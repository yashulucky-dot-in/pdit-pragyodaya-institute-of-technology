import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";

actor {
  // Initialize authorisation with role-based access control (see scripts/init.sh)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize storage (persistent)
  include MixinObjectStorage();

  // Types
  type AdmissionRecord = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    course : Text;
    city : Text;
    message : Text;
    timestamp : Int;
  };

  type FranchiseRecord = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    city : Text;
    investment : Text;
    message : Text;
    timestamp : Int;
  };

  type ContactRecord = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    timestamp : Int;
  };

  type UserProfile = {
    id : Nat;
    username : Text;
    password : Text;
    fullName : Text;
    email : Text;
    phone : Text;
    course : Text;
    enrolledDate : Int;
    role : Text;
    progress : Nat;
    isActive : Bool;
  };

  type Announcement = {
    id : Nat;
    title : Text;
    content : Text;
    postedBy : Text;
    timestamp : Int;
  };

  type Course = {
    id : Nat;
    title : Text;
    subtitle : Text;
    description : Text;
    duration : Text;
    fee : Text;
    badge : Text;
    topics : [Text];
    colorKey : Text;
    isActive : Bool;
  };

  type BrochureRequest = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    courseId : Nat;
    courseName : Text;
    timestamp : Int;
  };

  type CourseLead = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    courseId : Nat;
    courseName : Text;
    message : Text;
    timestamp : Int;
    downloadCount : Nat;
  };

  type FranchiseLead = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    city : Text;
    investment : Text;
    message : Text;
    timestamp : Int;
    downloadCount : Nat;
    leadType : Text;
  };

  type BrochureUrl = {
    id : Nat;
    courseId : Nat;
    url : Text;
    urlType : Text;
  };

  // Admissions
  var admissions : [AdmissionRecord] = [];
  var admissionCounter = 0;

  public shared ({ caller }) func submitAdmission(name : Text, phone : Text, email : Text, course : Text, city : Text, message : Text) : async { ok : Nat } {
    admissionCounter += 1;
    let record : AdmissionRecord = {
      id = admissionCounter;
      name;
      phone;
      email;
      course;
      city;
      message;
      timestamp = Time.now();
    };
    admissions := admissions.concat([record]);
    { ok = admissionCounter };
  };

  public query ({ caller }) func getAdmissions() : async { ok : [AdmissionRecord] } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view admissions");
    };
    { ok = admissions };
  };

  // Franchise Inquiries
  var franchiseInquiries : [FranchiseRecord] = [];
  var franchiseCounter = 0;

  public shared ({ caller }) func submitFranchiseInquiry(name : Text, phone : Text, email : Text, city : Text, investment : Text, message : Text) : async { ok : Nat } {
    franchiseCounter += 1;
    let record : FranchiseRecord = {
      id = franchiseCounter;
      name;
      phone;
      email;
      city;
      investment;
      message;
      timestamp = Time.now();
    };
    franchiseInquiries := franchiseInquiries.concat([record]);
    { ok = franchiseCounter };
  };

  public query ({ caller }) func getFranchiseInquiries() : async { ok : [FranchiseRecord] } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view franchise inquiries");
    };
    { ok = franchiseInquiries };
  };

  // Contact Messages
  var contactMessages : [ContactRecord] = [];
  var contactCounter = 0;

  public shared ({ caller }) func submitContact(name : Text, email : Text, phone : Text, message : Text) : async { ok : Nat } {
    contactCounter += 1;
    let record : ContactRecord = {
      id = contactCounter;
      name;
      email;
      phone;
      message;
      timestamp = Time.now();
    };
    contactMessages := contactMessages.concat([record]);
    { ok = contactCounter };
  };

  public query ({ caller }) func getContactMessages() : async { ok : [ContactRecord] } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    { ok = contactMessages };
  };

  // User Management
  var userIdCounter = 2;
  var users = Map.fromIter<Text, UserProfile>(
    [
      (
        "admin",
        {
          id = 1;
          username = "admin";
          password = "admin123";
          fullName = "Admin User";
          email = "admin@example.com";
          phone = "1234567890";
          course = "";
          enrolledDate = Time.now();
          role = "admin";
          progress = 0;
          isActive = true;
        },
      ),
      (
        "student",
        {
          id = 2;
          username = "student";
          password = "student123";
          fullName = "Demo Student";
          email = "student@example.com";
          phone = "0987654321";
          course = "Web Development";
          enrolledDate = Time.now();
          role = "student";
          progress = 0;
          isActive = true;
        },
      ),
    ].values(),
  );

  var userPrincipals = Map.empty<Text, Principal>();
  var principalProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func registerUser(username : Text, password : Text, fullName : Text, email : Text, phone : Text, course : Text) : async { ok : UserProfile } {
    if (users.containsKey(username)) {
      Runtime.trap("Username already exists");
    };
    userIdCounter += 1;
    let newUser : UserProfile = {
      id = userIdCounter;
      username;
      password;
      fullName;
      email;
      phone;
      course;
      enrolledDate = Time.now();
      role = "student";
      progress = 0;
      isActive = true;
    };
    users.add(username, newUser);
    userPrincipals.add(username, caller);
    principalProfiles.add(caller, newUser);
    AccessControl.assignRole(accessControlState, caller, caller, #user);
    { ok = newUser };
  };

  public query ({ caller }) func loginUser(username : Text, password : Text) : async { ok : UserProfile } {
    switch (users.get(username)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        if (user.password == password) {
          { ok = user };
        } else {
          Runtime.trap("Invalid credentials");
        };
      };
    };
  };

  // Frontend-required profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    principalProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    principalProfiles.add(caller, profile);
    // Also update in username map if exists
    users.add(profile.username, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    principalProfiles.get(user);
  };

  // Legacy username-based profile access
  public query ({ caller }) func getUserProfileByUsername(username : Text) : async { ok : UserProfile } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    switch (users.get(username)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        let isOwnProfile = switch (userPrincipals.get(username)) {
          case (null) { false };
          case (?userPrincipal) { Principal.equal(caller, userPrincipal) };
        };
        if (not isOwnProfile and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own profile");
        };
        { ok = user };
      };
    };
  };

  public shared ({ caller }) func updateUserProfile(username : Text, fullName : Text, email : Text, phone : Text) : async { ok : UserProfile } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update profiles");
    };
    switch (users.get(username)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        let isOwnProfile = switch (userPrincipals.get(username)) {
          case (null) { false };
          case (?userPrincipal) { Principal.equal(caller, userPrincipal) };
        };
        if (not isOwnProfile and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own profile");
        };
        let updatedUser : UserProfile = {
          id = user.id;
          username = user.username;
          password = user.password;
          fullName;
          email;
          phone;
          course = user.course;
          enrolledDate = user.enrolledDate;
          role = user.role;
          progress = user.progress;
          isActive = user.isActive;
        };
        users.add(username, updatedUser);
        principalProfiles.add(caller, updatedUser);
        { ok = updatedUser };
      };
    };
  };

  public query ({ caller }) func getAllStudents() : async { ok : [UserProfile] } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all students");
    };
    { ok = users.values().filter(func(user) { user.role == "student" }).toArray() };
  };

  public shared ({ caller }) func updateStudentProgress(username : Text, progress : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update student progress");
    };
    switch (users.get(username)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        let updatedUser : UserProfile = {
          id = user.id;
          username = user.username;
          password = user.password;
          fullName = user.fullName;
          email = user.email;
          phone = user.phone;
          course = user.course;
          enrolledDate = user.enrolledDate;
          role = user.role;
          progress;
          isActive = user.isActive;
        };
        users.add(username, updatedUser);
        // Update principal profile if exists
        switch (userPrincipals.get(username)) {
          case (?userPrincipal) { principalProfiles.add(userPrincipal, updatedUser) };
          case (null) {};
        };
        true;
      };
    };
  };

  public query ({ caller }) func getStudentProgress(username : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view progress");
    };
    switch (users.get(username)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        let isOwnProfile = switch (userPrincipals.get(username)) {
          case (null) { false };
          case (?userPrincipal) { Principal.equal(caller, userPrincipal) };
        };
        if (not isOwnProfile and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own progress");
        };
        user.progress;
      };
    };
  };

  // Announcements
  var announcements = Map.fromIter<Nat, Announcement>(
    [
      (1, { id = 1; title = "Welcome to PDIT"; content = "We are excited to have you on board!"; postedBy = "admin"; timestamp = Time.now() }),
      (2, { id = 2; title = "New Course Launch"; content = "Check out our new Web Development course."; postedBy = "admin"; timestamp = Time.now() }),
      (3, { id = 3; title = "Holiday Notice"; content = "Institute will be closed on national holidays."; postedBy = "admin"; timestamp = Time.now() }),
    ].values(),
  );
  var announcementCounter = 3;

  public shared ({ caller }) func addAnnouncement(title : Text, content : Text, postedBy : Text) : async { ok : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add announcements");
    };
    announcementCounter += 1;
    let newAnnouncement : Announcement = { id = announcementCounter; title; content; postedBy; timestamp = Time.now() };
    announcements.add(announcementCounter, newAnnouncement);
    { ok = announcementCounter };
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };
    switch (announcements.get(id)) {
      case (null) { false };
      case (_) {
        announcements.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getAnnouncements() : async { ok : [Announcement] } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view announcements");
    };
    { ok = announcements.values().toArray() };
  };

  // Course Management
  var courses = Map.fromIter<Nat, Course>(
    [
      (1, { id = 1; title = "Web Development"; subtitle = "Frontend & Backend"; description = "Learn HTML, CSS, JavaScript, PHP, MySQL, Laravel, and more. Master both frontend and backend development with practical projects."; duration = "8+ Months"; fee = "\u{20B9}38,000"; badge = "web-dev"; topics = ["HTML5 & CSS3", "JavaScript ES6+", "PHP & MySQL", "Laravel Framework", "Git & Deployment", "WordPress Development"]; colorKey = "#0067B0"; isActive = true }),
      (2, { id = 2; title = "Full Stack Development"; subtitle = "Comprehensive Coding"; description = "Become a full stack developer by learning both frontend and backend technologies. Covers HTML, CSS, JavaScript, PHP, MySQL, Laravel."; duration = "10+ Months"; fee = "\u{20B9}48,000"; badge = "full-stack"; topics = ["Complete Web Development", "Backend with Laravel", "Advanced JavaScript", "Database Management", "Server Deployment", "Project Management"]; colorKey = "#F7C002"; isActive = true }),
      (3, { id = 3; title = "Digital Marketing"; subtitle = "Online Promotion"; description = "Master the art of digital marketing by learning SEO, Google Ads, social media marketing, content creation, and analytics tools."; duration = "5+ Months"; fee = "\u{20B9}28,000"; badge = "digital-marketing"; topics = ["SEO & SEM", "Google Ads Mastery", "Social Media Marketing", "Content Creation", "Analytics Tools", "Email Marketing"]; colorKey = "#F03B2F"; isActive = true }),
      (4, { id = 4; title = "Graphic Design"; subtitle = "Creative Arts"; description = "Unleash your creativity with Adobe Photoshop, Illustrator, CorelDRAW. Develop skills in logo design, branding, digital art."; duration = "8+ Months"; fee = "\u{20B9}28,000"; badge = "graphic-design"; topics = ["Adobe Photoshop & Illustrator", "Logo & Branding Design", "CorelDRAW Mastery", "Digital Art Creation", "Marketing Designs"]; colorKey = "#097D61"; isActive = true }),
      (5, { id = 5; title = "Computer Applications"; subtitle = "Basic to Advanced"; description = "Gain essential computer skills including MS Office, advanced Excel, Tally ERP 9, and internet navigation."; duration = "8+ Months"; fee = "\u{20B9}22,000"; badge = "computer-applications"; topics = ["MS Office Suite", "Excel Advanced Functions", "Tally ERP 9", "Internet Navigation", "Productivity Hacks"]; colorKey = "#846B27"; isActive = true }),
      (6, { id = 6; title = "Freelancing Skills"; subtitle = "Professional Work"; description = "Learn how to start and grow a successful freelancing career. Topics include business setup, client management, project bidding."; duration = "25 Days"; fee = "\u{20B9}7,000"; badge = "freelancing"; topics = ["Business Setup", "Client Management", "Communication Skills", "Pitching & Bidding", "Portfolio Building", "Internet Marketing"]; colorKey = "#706974"; isActive = true }),
    ].values(),
  );
  var maxCourseId = 6;

  public shared ({ caller }) func createCourse(title : Text, subtitle : Text, description : Text, duration : Text, fee : Text, badge : Text, topics : [Text], colorKey : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create courses");
    };
    let newCourseId = maxCourseId + 1;
    courses.add(newCourseId, { id = newCourseId; title; subtitle; description; duration; fee; badge; topics; colorKey; isActive = true });
    maxCourseId := newCourseId;
    newCourseId;
  };

  public shared ({ caller }) func updateCourse(id : Nat, title : Text, subtitle : Text, description : Text, duration : Text, fee : Text, badge : Text, topics : [Text], colorKey : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update courses");
    };
    switch (courses.get(id)) {
      case (null) { false };
      case (?course) {
        courses.add(id, { id; title; subtitle; description; duration; fee; badge; topics; colorKey; isActive = course.isActive });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteCourse(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete courses");
    };
    switch (courses.get(id)) {
      case (null) { false };
      case (_) {
        courses.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getCourses() : async { ok : [Course] } {
    { ok = courses.values().filter(func(course) { course.isActive }).toArray() };
  };

  // Legacy Brochure Requests
  var brochureRequests = Map.empty<Nat, BrochureRequest>();
  var maxBrochureRequestId = 0;

  public shared ({ caller }) func submitBrochureRequest(name : Text, phone : Text, email : Text, courseId : ?Nat, courseName : Text) : async Nat {
    let newId = maxBrochureRequestId + 1 : Nat;
    let (courseIdValue, courseDetails) = switch (courseId) {
      case (null) { (0, courseName) };
      case (?id) {
        switch (courses.get(id)) {
          case (null) { (id, courseName) };
          case (?courseFound) { (id, courseFound.title # " - " # courseFound.subtitle) };
        };
      };
    };
    brochureRequests.add(newId, { id = newId; name; phone; email; courseId = courseIdValue; courseName = courseDetails; timestamp = Time.now() });
    maxBrochureRequestId := newId;
    newId;
  };

  public query ({ caller }) func getBrochureRequests() : async [BrochureRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view brochure requests");
    };
    brochureRequests.values().toArray();
  };

  // Course Leads (new lead generation system)
  var courseLeads = Map.empty<Nat, CourseLead>();
  var maxCourseLeadId = 0;

  // Public endpoint - anyone can submit a course lead
  public shared ({ caller }) func submitCourseLead(name : Text, email : Text, phone : Text, courseId : Nat, courseName : Text, message : Text) : async Nat {
    let newId = maxCourseLeadId + 1 : Nat;
    let resolvedCourseName = switch (courses.get(courseId)) {
      case (null) { courseName };
      case (?c) { c.title };
    };
    courseLeads.add(newId, {
      id = newId;
      name;
      email;
      phone;
      courseId;
      courseName = resolvedCourseName;
      message;
      timestamp = Time.now();
      downloadCount = 0;
    });
    maxCourseLeadId := newId;
    newId;
  };

  // Franchise Leads (new lead generation system)
  var franchiseLeads = Map.empty<Nat, FranchiseLead>();
  var maxFranchiseLeadId = 0;

  // Public endpoint - anyone can submit a franchise lead
  public shared ({ caller }) func submitFranchiseLead(name : Text, email : Text, phone : Text, city : Text, investment : Text, message : Text) : async Nat {
    let newId = maxFranchiseLeadId + 1 : Nat;
    franchiseLeads.add(newId, {
      id = newId;
      name;
      email;
      phone;
      city;
      investment;
      message;
      timestamp = Time.now();
      downloadCount = 0;
      leadType = "Franchise Lead";
    });
    maxFranchiseLeadId := newId;
    newId;
  };

  // Public endpoint - track brochure download
  public shared ({ caller }) func trackDownload(leadId : Nat, leadType : Text) : async Bool {
    if (leadType == "course") {
      switch (courseLeads.get(leadId)) {
        case (null) { false };
        case (?lead) {
          courseLeads.add(leadId, {
            id = lead.id;
            name = lead.name;
            email = lead.email;
            phone = lead.phone;
            courseId = lead.courseId;
            courseName = lead.courseName;
            message = lead.message;
            timestamp = lead.timestamp;
            downloadCount = lead.downloadCount + 1;
          });
          true;
        };
      };
    } else {
      switch (franchiseLeads.get(leadId)) {
        case (null) { false };
        case (?lead) {
          franchiseLeads.add(leadId, {
            id = lead.id;
            name = lead.name;
            email = lead.email;
            phone = lead.phone;
            city = lead.city;
            investment = lead.investment;
            message = lead.message;
            timestamp = lead.timestamp;
            downloadCount = lead.downloadCount + 1;
            leadType = lead.leadType;
          });
          true;
        };
      };
    };
  };

  // Admin-only endpoint - get all leads
  public query ({ caller }) func getAllLeads() : async { courseLeads : [CourseLead]; franchiseLeads : [FranchiseLead] } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all leads");
    };
    {
      courseLeads = courseLeads.values().toArray();
      franchiseLeads = franchiseLeads.values().toArray();
    };
  };

  // Brochure URL Management
  var brochureUrls = Map.empty<Nat, BrochureUrl>();
  var maxBrochureUrlId = 0;

  // Admin-only endpoint - set brochure URL for course or franchise
  public shared ({ caller }) func setBrochureUrl(courseId : Nat, url : Text, urlType : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set brochure URLs");
    };
    // Find existing entry for this courseId+urlType and update, or create new
    var existingId : ?Nat = null;
    for ((k, v) in brochureUrls.entries()) {
      if (v.courseId == courseId and v.urlType == urlType) {
        existingId := ?k;
      };
    };
    switch (existingId) {
      case (?id) {
        brochureUrls.add(id, { id; courseId; url; urlType });
      };
      case (null) {
        let newId = maxBrochureUrlId + 1;
        brochureUrls.add(newId, { id = newId; courseId; url; urlType });
        maxBrochureUrlId := newId;
      };
    };
    true;
  };

  // Admin-only endpoint - get all brochure URLs
  public query ({ caller }) func getBrochureUrls() : async [BrochureUrl] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view brochure URLs");
    };
    brochureUrls.values().toArray();
  };

  // Public endpoint - get brochure URL for a specific course
  public query ({ caller }) func getBrochureUrlByCourseId(courseId : Nat) : async ?BrochureUrl {
    var result : ?BrochureUrl = null;
    for ((_, v) in brochureUrls.entries()) {
      if (v.courseId == courseId and v.urlType == "course") {
        result := ?v;
      };
    };
    result;
  };

  // Public endpoint - get franchise brochure URL
  public query ({ caller }) func getFranchiseBrochureUrl() : async ?BrochureUrl {
    var result : ?BrochureUrl = null;
    for ((_, v) in brochureUrls.entries()) {
      if (v.urlType == "franchise") {
        result := ?v;
      };
    };
    result;
  };
};
