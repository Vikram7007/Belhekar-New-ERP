const db = require('./database');

function seedDatabase() {
  console.log('🌱 Seeding Belhekar ERP Database with complete realistic dataset...');

  // 1. Insert 12 Institutions from PDF
  const institutions = [
    { name: 'Sant Dnyaneshwar MBA & MCA College', code: 'SD-MBA-MCA', short: 'MBA & MCA', cat: 'Higher Education' },
    { name: 'P.V. Belhekar Ayurveda Medical College (BAMS)', code: 'PVB-BAMS', short: 'Ayurveda Medical (BAMS)', cat: 'Medical' },
    { name: 'College of Agriculture (Bsc Agri)', code: 'COA-AGRI', short: 'Agriculture (B.Sc)', cat: 'Agriculture' },
    { name: 'P.V. Belhekar College of Pharmacy (D.Pharm and B.Pharm)', code: 'PVB-PHARM', short: 'Pharmacy (D/B.Pharm)', cat: 'Pharmacy' },
    { name: 'Dnyaneshwar Polytechnic College (Polytechnic)', code: 'DPC-POLY', short: 'Polytechnic Diploma', cat: 'Technical' },
    { name: 'P.V. Belhekar College of Nursing (GNM)', code: 'PVB-NURS', short: 'Nursing (GNM)', cat: 'Nursing' },
    { name: 'BCA College (BCA)', code: 'BCA-COL', short: 'BCA College', cat: 'Computer Applications' },
    { name: 'Late P.V. Belhekar College (BA)', code: 'LPVB-BA', short: 'Arts College (B.A.)', cat: 'Arts' },
    { name: 'Dnyaneshwar Private Industrial Training Institute (ITI)', code: 'DP-ITI', short: 'ITI Vocational', cat: 'Vocational' },
    { name: 'Sant Dnyaneshwar B.Ed. College (Bed)', code: 'SD-BED', short: 'Education (B.Ed)', cat: 'Education' },
    { name: 'Dnyaneshwar International School (DIS)', code: 'DIS-SCH', short: 'International School', cat: 'School' },
    { name: 'Dnyaneshwar Public School and Junior College (DPS)', code: 'DPS-JC', short: 'Public School & Jr College', cat: 'School & Jr College' },
  ];

  const checkInst = db.prepare('SELECT COUNT(*) as count FROM institutions').get();
  if (checkInst.count === 0) {
    const insertInst = db.prepare(`
      INSERT INTO institutions (name, code, short_name, category, address, phone, email, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    institutions.forEach(inst => {
      insertInst.run(
        inst.name,
        inst.code,
        inst.short,
        inst.cat,
        'Belhekar Educational Campus, Sangamner-Pune Highway, Maharashtra 413714',
        '+91 2425 224500 / 9822001122',
        `contact@${inst.code.toLowerCase().replace(/[^a-z]/g, '')}.belhekar.edu.in`,
        'https://belhekar.edu.in'
      );
    });
    console.log(`✅ Seeded ${institutions.length} Institutions.`);
  }

  // 2. Default Users for the 7 Portals
  const checkUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (checkUsers.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (institution_id, username, password_hash, full_name, email, role, designation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const users = [
      { u: 'admin', p: 'admin123', name: 'Dr. S. K. Belhekar (Chairman)', email: 'admin@belhekar.edu', role: 'Admin', desig: 'Campus Administrator' },
      { u: 'principal', p: 'prin123', name: 'Dr. Rameshwar V. Patil', email: 'principal@belhekar.edu', role: 'Principal', desig: 'Director & Principal' },
      { u: 'clerk', p: 'clerk123', name: 'Sunil D. Deshmukh', email: 'clerk@belhekar.edu', role: 'Clerk', desig: 'Senior Academic Registrar / Clerk' },
      { u: 'faculty', p: 'fac123', name: 'Prof. Anjali M. Shinde', email: 'faculty@belhekar.edu', role: 'Faculty', desig: 'Assistant Professor & HOD' },
      { u: 'account', p: 'acc123', name: 'Mahesh B. Kulkarni', email: 'accounts@belhekar.edu', role: 'Account', desig: 'Chief Finance & Accounts Officer' },
      { u: 'store', p: 'store123', name: 'Ganesh T. Jadhav', email: 'store@belhekar.edu', role: 'Store', desig: 'Central Store & Asset Officer' },
      { u: 'librarian', p: 'lib123', name: 'Pooja R. Bhalerao', email: 'librarian@belhekar.edu', role: 'Librarian', desig: 'Chief Librarian & Resource Manager' }
    ];

    users.forEach(usr => {
      insertUser.run(1, usr.u, usr.p, usr.name, usr.email, usr.role, usr.desig);
    });
    console.log(`✅ Seeded ${users.length} Role-Based Accounts.`);
  }

  // 3. Sample Students
  const checkStudents = db.prepare('SELECT COUNT(*) as count FROM students').get();
  if (checkStudents.count === 0) {
    const insertStudent = db.prepare(`
      INSERT INTO students (
        institution_id, application_id, enrollment_no, abc_id, department, admission_year, current_year,
        full_name, dob, gender, category, cap_type, birth_place, father_name, mother_name,
        mobile_no, parent_mobile, address, email, aadhar_no, photo_url,
        registration_fee, tuition_fee, development_fee, exam_fee, other_fee,
        is_scholarship_eligible, scholarship_inst1_status, scholarship_inst2_status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `);

    const sampleStudents = [
      {
        inst: 1, app: 'APP-2024-MBA01', enr: 'ENR-24-00101', abc: 'ABC-9821-4321-0001', dept: 'MBA Marketing',
        adm: '2024-25', yr: 'Second Year', name: 'Vikram Dnyaneshwar Belhekar', dob: '2002-04-14', gen: 'Male',
        cat: 'General', cap: 'CAP Level-I', bp: 'Sangamner', f: 'Dnyaneshwar Belhekar', m: 'Sunita Belhekar',
        mob: '9822100455', pmob: '9422003311', addr: 'At Post Belhe, Tal. Junnar, Dist. Pune 412410',
        em: 'vikram.belhekar@gmail.com', aadh: '4532 8901 2345',
        reg: 2500, tuit: 65000, dev: 12000, exam: 3500, oth: 4000, schol: 1, s1: 'Received', s2: 'Adjusted'
      },
      {
        inst: 1, app: 'APP-2024-MCA02', enr: 'ENR-24-00102', abc: 'ABC-9821-4321-0002', dept: 'MCA Computer Applications',
        adm: '2024-25', yr: 'First Year', name: 'Pooja Sanjay Ghorpade', dob: '2003-08-22', gen: 'Female',
        cat: 'OBC', cap: 'CAP Level-II', bp: 'Pune', f: 'Sanjay Ghorpade', m: 'Mangal Ghorpade',
        mob: '9822334455', pmob: '9850112233', addr: 'Plot 45, Anand Nagar, Sangamner, Dist. Ahmednagar',
        em: 'pooja.ghorpade@gmail.com', aadh: '6543 2109 8765',
        reg: 2500, tuit: 55000, dev: 10000, exam: 3500, oth: 3500, schol: 1, s1: 'Received', s2: 'Pending'
      },
      {
        inst: 2, app: 'APP-2023-BAMS01', enr: 'ENR-23-00201', abc: 'ABC-9821-4321-0003', dept: 'Kayachikitsa (Ayurveda)',
        adm: '2023-24', yr: 'Third Year', name: 'Aditya Rajendra Deshmukh', dob: '2001-11-05', gen: 'Male',
        cat: 'EWS', cap: 'Against CAP', bp: 'Nashik', f: 'Rajendra Deshmukh', m: 'Surekha Deshmukh',
        mob: '9123456780', pmob: '9423112244', addr: 'Ayurveda Colony, Sangamner Bypass, Dist. Ahmednagar',
        em: 'aditya.deshmukh@bams.belhekar.edu', aadh: '7890 1234 5678',
        reg: 5000, tuit: 120000, dev: 25000, exam: 5000, oth: 8000, schol: 0, s1: 'Pending', s2: 'Pending'
      },
      {
        inst: 4, app: 'APP-2024-BPHARM01', enr: 'ENR-24-00401', abc: 'ABC-9821-4321-0004', dept: 'Pharmaceutics',
        adm: '2024-25', yr: 'First Year', name: 'Snehal Nitin Kadam', dob: '2004-02-18', gen: 'Female',
        cat: 'SC', cap: 'CAP Level-I', bp: 'Alephata', f: 'Nitin Kadam', m: 'Savita Kadam',
        mob: '9765432190', pmob: '9822998877', addr: 'B-12, Green Park, Alephata, Pune 412411',
        em: 'snehal.kadam@pharm.belhekar.edu', aadh: '8901 2345 6789',
        reg: 2000, tuit: 45000, dev: 8000, exam: 3000, oth: 2000, schol: 1, s1: 'Received', s2: 'Received'
      },
      {
        inst: 5, app: 'APP-2024-POLY01', enr: 'ENR-24-00501', abc: 'ABC-9821-4321-0005', dept: 'Mechanical Engineering',
        adm: '2024-25', yr: 'Second Year', name: 'Rohan Vijay Shinde', dob: '2005-06-10', gen: 'Male',
        cat: 'OBC', cap: 'Institute Level', bp: 'Junnar', f: 'Vijay Shinde', m: 'Archana Shinde',
        mob: '9654321098', pmob: '9422556677', addr: 'Near Shivneri Fort Road, Junnar 410502',
        em: 'rohan.shinde@poly.belhekar.edu', aadh: '9012 3456 7890',
        reg: 1500, tuit: 38000, dev: 7000, exam: 2500, oth: 1500, schol: 1, s1: 'Received', s2: 'Pending'
      },
      {
        inst: 7, app: 'APP-2024-BCA01', enr: 'ENR-24-00701', abc: 'ABC-9821-4321-0006', dept: 'Data Science & AI',
        adm: '2024-25', yr: 'Third Year', name: 'Tanvi Dilip More', dob: '2003-09-14', gen: 'Female',
        cat: 'General', cap: 'CAP Level-I', bp: 'Sangamner', f: 'Dilip More', m: 'Anita More',
        mob: '9543210987', pmob: '9822445566', addr: 'Shivaji Chowk, Sangamner, 422605',
        em: 'tanvi.more@bca.belhekar.edu', aadh: '1234 5678 9012',
        reg: 2000, tuit: 40000, dev: 8000, exam: 3000, oth: 2500, schol: 0, s1: 'Pending', s2: 'Pending'
      }
    ];

    sampleStudents.forEach(s => {
      insertStudent.run(
        s.inst, s.app, s.enr, s.abc, s.dept, s.adm, s.yr,
        s.name, s.dob, s.gen, s.cat, s.cap, s.bp, s.f, s.m,
        s.mob, s.pmob, s.addr, s.em, s.aadh, '',
        s.reg, s.tuit, s.dev, s.exam, s.oth,
        s.schol, s.s1, s.s2
      );
    });
    console.log(`✅ Seeded ${sampleStudents.length} Students.`);
  }

  // 4. Sample Faculty
  const checkFaculty = db.prepare('SELECT COUNT(*) as count FROM faculty').get();
  if (checkFaculty.count === 0) {
    const insertFaculty = db.prepare(`
      INSERT INTO faculty (
        institution_id, full_name, dob, gender, category, father_name, mother_name,
        year_of_joining, department, designation, qualification, email, mobile_no, emergency_mobile,
        address, pan_no, aadhar_no, abc_id, bank_account_no, bank_ifsc, bank_branch, base_salary
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const sampleFaculty = [
      {
        inst: 1, name: 'Prof. Anjali M. Shinde', dob: '1985-05-12', gen: 'Female', cat: 'Open', f: 'Manohar Shinde', m: 'Usha Shinde',
        doj: '2016', dept: 'MBA & MCA Management', desig: 'Associate Professor & HOD', qual: 'Ph.D (Mgmt), MBA (Finance), UGC-NET',
        em: 'anjali.shinde@belhekar.edu', mob: '9822119988', emob: '9422001199', addr: 'Staff Quarters Q-4, Belhekar Campus',
        pan: 'ABCPS9821K', aadh: '3456 7890 1234', abc: 'FAC-ABC-001', bank: '30987123456', ifsc: 'SBIN0001245', branch: 'Sangamner Main', sal: 78500
      },
      {
        inst: 1, name: 'Prof. Nilesh K. Thorat', dob: '1988-09-24', gen: 'Male', cat: 'OBC', f: 'Kashinath Thorat', m: 'Laxmi Thorat',
        doj: '2018', dept: 'MCA Computer Applications', desig: 'Assistant Professor', qual: 'M.Tech (CSE), MCA, Ph.D Pursuing',
        em: 'nilesh.thorat@belhekar.edu', mob: '9822336699', emob: '9850117788', addr: 'Flat 302, Sai Residency, Sangamner',
        pan: 'BNTPS6543M', aadh: '5678 9012 3456', abc: 'FAC-ABC-002', bank: '40982234123', ifsc: 'HDFC0000452', branch: 'Sangamner Bypass', sal: 62000
      },
      {
        inst: 2, name: 'Vaidya Dr. Satish V. Bhalerao', dob: '1979-01-15', gen: 'Male', cat: 'General', f: 'Vasantrao Bhalerao', m: 'Sindhu Bhalerao',
        doj: '2014', dept: 'Kayachikitsa & Panchakarma', desig: 'Professor & Dean', qual: 'BAMS, MD (Ayurveda), Ph.D',
        em: 'satish.bhalerao@bams.belhekar.edu', mob: '9822440011', emob: '9422114400', addr: 'Belhekar Ayurveda Staff Enclave, Belhe',
        pan: 'CKMPB4431P', aadh: '6789 0123 4567', abc: 'FAC-ABC-003', bank: '10984455667', ifsc: 'MAHB0000210', branch: 'Belhe Rural', sal: 95000
      },
      {
        inst: 4, name: 'Dr. Meena Ravindra Dighe', dob: '1986-07-30', gen: 'Female', cat: 'OBC', f: 'Ravindra Dighe', m: 'Kalpana Dighe',
        doj: '2019', dept: 'Pharmaceutics & Quality Assurance', desig: 'Associate Professor', qual: 'M.Pharm, Ph.D, GPAT Qualified',
        em: 'meena.dighe@pharm.belhekar.edu', mob: '9822774411', emob: '9422663322', addr: 'Vidyanagar, Sangamner, 422605',
        pan: 'DJKPD8821R', aadh: '7890 1234 5670', abc: 'FAC-ABC-004', bank: '50123344556', ifsc: 'BARB0SANGAM', branch: 'Sangamner Bank of Baroda', sal: 71000
      }
    ];

    sampleFaculty.forEach(f => {
      insertFaculty.run(
        f.inst, f.name, f.dob, f.gen, f.cat, f.f, f.m,
        f.doj, f.dept, f.desig, f.qual, f.em, f.mob, f.emob,
        f.addr, f.pan, f.aadh, f.abc, f.bank, f.ifsc, f.branch, f.sal
      );
    });
    console.log(`✅ Seeded ${sampleFaculty.length} Faculty Members.`);
  }

  // 5. Sample Attendance Records
  const checkAtt = db.prepare('SELECT COUNT(*) as count FROM student_attendance').get();
  if (checkAtt.count === 0) {
    const insertStuAtt = db.prepare(`
      INSERT INTO student_attendance (institution_id, student_id, date, status, in_time, out_time, duration_minutes, source, subject)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStuAtt.run(1, 1, '2026-10-01', 'Present', '09:05 AM', '04:30 PM', 445, 'ESSL Biometric', 'Strategic Financial Management');
    insertStuAtt.run(1, 1, '2026-10-02', 'Present', '08:58 AM', '04:32 PM', 454, 'Hikvision Biometric', 'Business Analytics');
    insertStuAtt.run(1, 2, '2026-10-01', 'Present', '09:12 AM', '04:25 PM', 433, 'Hikvision Biometric', 'Advanced Cloud Computing');
    insertStuAtt.run(1, 2, '2026-10-02', 'Absent', null, null, 0, 'Manual', 'Enterprise Architecture');
    insertStuAtt.run(2, 3, '2026-10-01', 'Present', '08:45 AM', '03:45 PM', 420, 'ESSL Biometric', 'Charak Samhita');

    const insertFacAtt = db.prepare(`
      INSERT INTO faculty_attendance (institution_id, faculty_id, date, status, in_time, out_time, duration_minutes, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertFacAtt.run(1, 1, '2026-10-01', 'Present', '08:50 AM', '05:10 PM', 500, 'ESSL Biometric');
    insertFacAtt.run(1, 1, '2026-10-02', 'Present', '08:52 AM', '05:05 PM', 493, 'Hikvision Biometric');
    insertFacAtt.run(1, 2, '2026-10-01', 'Present', '08:55 AM', '05:15 PM', 500, 'Hikvision Biometric');
    insertFacAtt.run(2, 3, '2026-10-01', 'Present', '08:40 AM', '04:50 PM', 490, 'ESSL Biometric');

    console.log('✅ Seeded Student & Faculty Attendance logs.');
  }

  // 6. Sample Internal Marks (K3, K5, K6 frameworks from PDF)
  const checkMarks = db.prepare('SELECT COUNT(*) as count FROM internal_marks').get();
  if (checkMarks.count === 0) {
    const insertMarks = db.prepare(`
      INSERT INTO internal_marks (institution_id, student_id, department, academic_year, subject, k3_score, k5_score, k6_score, max_k3, max_k5, max_k6, total_score, max_total, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMarks.run(1, 1, 'MBA Marketing', '2025-26', 'Consumer Behavior & Market Analytics', 18, 17, 19, 20, 20, 20, 54, 60, 'Excellent conceptual depth in K6 synthesis');
    insertMarks.run(1, 1, 'MBA Marketing', '2025-26', 'Digital Business Models & Strategy', 19, 18, 18, 20, 20, 20, 55, 60, 'Outstanding case analysis');
    insertMarks.run(1, 2, 'MCA Computer Applications', '2025-26', 'Full Stack Cloud Architecture', 17, 16, 17, 20, 20, 20, 50, 60, 'Strong practical coding ability');
    insertMarks.run(2, 3, 'Kayachikitsa (Ayurveda)', '2025-26', 'Panchakarma Clinical Principles', 19, 19, 18, 20, 20, 20, 56, 60, 'High clinical diagnosis accuracy');
    console.log('✅ Seeded Internal Marks (K3/K5/K6 framework).');
  }

  // 7. Placements & Alumni
  const checkPlacements = db.prepare('SELECT COUNT(*) as count FROM placement_records').get();
  if (checkPlacements.count === 0) {
    const insertPlc = db.prepare(`
      INSERT INTO placement_records (institution_id, student_name, enrollment_no, academic_year, department, company_name, ctc_package_lpa, designation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPlc.run(1, 'Gaurav Kishor Sonawane', 'ENR-22-00088', '2024-25', 'MCA Computer Applications', 'Tata Consultancy Services (TCS)', 7.5, 'Systems Engineer');
    insertPlc.run(1, 'Krutika Anand Deshpande', 'ENR-22-00045', '2024-25', 'MBA Marketing', 'HDFC Bank Ltd', 6.8, 'Deputy Manager - Wealth');
    insertPlc.run(4, 'Suraj Balasaheb Jadhav', 'ENR-21-00120', '2024-25', 'B.Pharm', 'Cipla Pharmaceuticals', 5.4, 'Quality Control Associate');
    insertPlc.run(7, 'Akash Devidas Shinde', 'ENR-22-00305', '2024-25', 'BCA', 'Infosys BPM', 4.8, 'Software Analyst');

    const insertAlumni = db.prepare(`
      INSERT INTO alumni_records (institution_id, student_name, enrollment_no, passing_year, department, current_company, current_designation, ctc_lpa, higher_studies, email, mobile_no, city)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAlumni.run(1, 'Amit Subhashrao Jagtap', 'ENR-20-00012', '2022', 'MBA Finance', 'Deloitte India', 'Senior Financial Analyst', 12.5, 'CFA Level 2', 'amit.jagtap@gmail.com', '9822004411', 'Pune');
    insertAlumni.run(1, 'Sneha Balkrishna Pawar', 'ENR-21-00034', '2023', 'MCA', 'Wipro Technologies', 'Cloud DevOps Specialist', 9.2, 'AWS Certified Architect', 'sneha.pawar@outlook.com', '9822339900', 'Bengaluru');
    insertAlumni.run(5, 'Prashant Pandurang Dighe', 'ENR-19-00150', '2022', 'Polytechnic Mechanical', 'Mahindra & Mahindra', 'Production Engineer', 6.0, 'B.Tech Lateral', 'prashant.dighe@gmail.com', '9765112233', 'Nashik');

    console.log('✅ Seeded Placement and Alumni records.');
  }

  // 8. Financial Engine: Fee Collection & Expenditures
  const checkFees = db.prepare('SELECT COUNT(*) as count FROM fee_payments').get();
  if (checkFees.count === 0) {
    const insertFee = db.prepare(`
      INSERT INTO fee_payments (
        institution_id, receipt_no, student_id, payment_date, tuition_fee, development_fee,
        exam_fee, registration_fee, bonafide_fee, form15a_fee, lc_fee, hostel_fee,
        transport_fee, other_fee, scholarship_adjusted, total_amount, payment_mode, ref_transaction_no, remarks, created_by
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    insertFee.run(
      1, 'REC-2025-00101', 1, '2025-08-15', 40000, 8000,
      3500, 2500, 100, 0, 0, 0,
      0, 2000, 15000, 41100, 'UPI / Online', 'UPI98421092837', 'First Installment with MahaDBT scholarship adjust', 'Mahesh Kulkarni (Accountant)'
    );

    insertFee.run(
      1, 'REC-2025-00102', 2, '2025-09-02', 30000, 6000,
      3500, 2500, 0, 150, 0, 12000,
      4000, 1000, 10000, 49150, 'Net Banking', 'NEFT-SBIN20250902', 'Annual hostel and college term fees', 'Mahesh Kulkarni (Accountant)'
    );

    insertFee.run(
      2, 'REC-2025-00201', 3, '2025-08-20', 80000, 15000,
      5000, 5000, 100, 0, 0, 0,
      0, 5000, 0, 105100, 'Bank Cheque', 'CHQ-892100', 'BAMS Term-1 Complete Payment', 'Mahesh Kulkarni (Accountant)'
    );

    const insertExp = db.prepare(`
      INSERT INTO expenditures (institution_id, voucher_no, payment_date, category, payee_name, amount, payment_mode, cheque_no, description, approved_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertExp.run(1, 'EXP-2025-V001', '2025-09-30', 'Staff Payroll', 'Prof. Anjali M. Shinde & Faculty Team', 140500, 'Bank Cheque', 'CHQ-554410', 'Monthly staff salary disburse after biometric attendance audit', 'Dr. Rameshwar Patil (Principal)');
    insertExp.run(1, 'EXP-2025-V002', '2025-10-01', 'Petty Cash Voucher', 'Balaji Xerox & Printing Stationers', 4250, 'Cash', '', 'Printing answer sheets, semester examination question papers and receipts', 'Mahesh Kulkarni');
    insertExp.run(1, 'EXP-2025-V003', '2025-09-25', 'Vendor Bill Settlement', 'Sigma Infotech Systems & Cloud Servers', 28500, 'NEFT/RTGS', 'NEFT-AXIS2025', 'Campus ERP cloud hosting and Hikvision Biometric API maintenance', 'Dr. S. K. Belhekar');
    insertExp.run(1, 'EXP-2025-V004', '2025-09-28', 'Petty Cash Voucher', 'Campus Green Garden & Sanitation Services', 6800, 'Cash', '', 'Cleaning, sanitization and campus maintenance supplies', 'Mahesh Kulkarni');

    console.log('✅ Seeded Fee collections & Expenditure double-entry ledgers.');
  }

  // 9. Store & Inventory
  const checkStore = db.prepare('SELECT COUNT(*) as count FROM store_inventory').get();
  if (checkStore.count === 0) {
    const insertStore = db.prepare(`
      INSERT INTO store_inventory (institution_id, supplier_name, receipt_date, material_name, category, unit, received_qty, rate, total_cost, available_qty, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStore.run(1, 'Navneet Stationery Works Pvt Ltd', '2025-08-10', 'A4 Printing Paper (75 GSM)', 'Stationery', 'Rim / Ream', 200, 240, 48000, 145, 'Central Warehouse Bay-1');
    insertStore.run(1, 'Omkar Scientific & Lab Instruments', '2025-08-18', 'Chemical Lab Glassware & Beakers (500ml)', 'Laboratory', 'Sets', 50, 850, 42500, 38, 'Chemistry Lab Store');
    insertStore.run(1, 'Dell Technologies India', '2025-09-05', 'Dell OptiPlex Core i5 Desktop Systems', 'IT Hardware', 'Units', 25, 42000, 1050000, 22, 'Computer Lab 3');
    insertStore.run(1, 'Godrej Interio Commercial', '2025-09-12', 'Steel Faculty Ergonomic Chairs & Tables', 'Furniture', 'Pieces', 40, 2800, 112000, 32, 'Administrative Block');

    const insertDist = db.prepare(`
      INSERT INTO store_distributions (institution_id, item_id, distribution_date, recipient_name, recipient_type, target_institution, department, distributed_qty, remaining_qty, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertDist.run(1, 1, '2025-08-25', 'Prof. Nilesh Thorat', 'Department', 'Sant Dnyaneshwar MBA & MCA College', 'MCA Lab', 25, 175, 'For project documentation and exam printouts');
    insertDist.run(1, 1, '2025-09-15', 'Sunil Deshmukh (Clerk)', 'Office', 'Sant Dnyaneshwar MBA & MCA College', 'Examination Cell', 30, 145, 'Question paper printing');
    insertDist.run(1, 3, '2025-09-20', 'Lab Incharge Deshmukh', 'Lab', 'Sant Dnyaneshwar MBA & MCA College', 'MCA Computer Lab', 3, 22, 'Installed at faculty project development pod');

    console.log('✅ Seeded Store & Inventory.');
  }

  // 10. Library (Books & Journals, Circulation, Fine)
  const checkLib = db.prepare('SELECT COUNT(*) as count FROM library_books').get();
  if (checkLib.count === 0) {
    const insertBook = db.prepare(`
      INSERT INTO library_books (institution_id, accession_no, title, author, publisher, edition, category, shelf_location, total_copies, available_copies, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBook.run(1, 'ACC-BK-00101', 'Management Information Systems: Managing Digital Firm', 'Kenneth C. Laudon & Jane P. Laudon', 'Pearson Education', '16th Global', 'Management', 'Rack M-02, Shelf 3', 8, 6, 895);
    insertBook.run(1, 'ACC-BK-00102', 'Cloud Native Architecture and Design Patterns', 'Michael J. Kavis', 'O Reilly Media', '2nd Edition', 'Computer Science', 'Rack CS-05, Shelf 1', 10, 7, 1250);
    insertBook.run(1, 'ACC-BK-00103', 'Marketing Management: An Asian Perspective', 'Philip Kotler & Kevin Lane Keller', 'Pearson', '15th Edition', 'Management', 'Rack M-01, Shelf 4', 12, 11, 950);
    insertBook.run(2, 'ACC-BK-00201', 'Charaka Samhita with English Commentary', 'Dr. Ram Karan Sharma & Vaidya Bhagwan Dash', 'Chowkhamba Sanskrit Series', '4th Edition', 'Ayurveda Medicine', 'Rack AY-01, Shelf 2', 5, 4, 3200);

    const insertJournal = db.prepare(`
      INSERT INTO library_journals (institution_id, accession_no, title, issn, publisher, frequency, volume_issue, subscription_year, shelf_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertJournal.run(1, 'ACC-JRN-001', 'Harvard Business Review (South Asia Edition)', '0017-8012', 'Harvard Business Publishing', 'Monthly', 'Vol. 102, Issue 4', '2025-26', 'Journal Display Stand J-1');
    insertJournal.run(1, 'ACC-JRN-002', 'IEEE Transactions on Software Engineering', '0098-5589', 'IEEE Computer Society', 'Quarterly', 'Vol. 50, No. 3', '2025-26', 'Journal Display Stand J-2');
    insertJournal.run(2, 'ACC-JRN-003', 'Journal of Ayurveda and Integrative Medicine (JAIM)', '0975-9476', 'Elsevier / WVA', 'Bi-Monthly', 'Vol. 15, Issue 2', '2025-26', 'Medical Reading Room M-1');

    const insertCirc = db.prepare(`
      INSERT INTO library_circulation (institution_id, item_type, item_id, borrower_type, borrower_id, issue_date, due_date, return_date, fine_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCirc.run(1, 'Book', 1, 'Student', 1, '2026-09-10', '2026-09-25', null, 20, 'Overdue');
    insertCirc.run(1, 'Book', 2, 'Faculty', 1, '2026-09-20', '2026-10-20', null, 0, 'Issued');

    console.log('✅ Seeded Library Books, Journals and Circulation.');
  }

  // 11. Biometric Devices (ESSL & Hikvision)
  const checkDev = db.prepare('SELECT COUNT(*) as count FROM biometric_devices').get();
  if (checkDev.count === 0) {
    const insertDev = db.prepare(`
      INSERT INTO biometric_devices (name, brand, ip_address, port, location, status, last_sync)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertDev.run('Main Academic Entrance ESSL-01', 'ESSL', '192.168.1.201', 4370, 'Campus Main Gate Porch', 'Online', '2026-10-03 11:30:00');
    insertDev.run('Faculty & Administrative Block Hikvision Face-01', 'Hikvision', '192.168.1.205', 8000, 'Administrative Office Lobby', 'Online', '2026-10-03 11:45:00');
    insertDev.run('Ayurveda Medical Hospital Biometric ESSL-02', 'ESSL', '192.168.2.110', 4370, 'Hospital OPD Staff Gate', 'Online', '2026-10-03 11:15:00');
    insertDev.run('Pharmacy & Science Block Hikvision-02', 'Hikvision', '192.168.3.150', 8000, 'Pharmacy Ground Floor Lab Corridor', 'Online', '2026-10-03 11:50:00');
    console.log('✅ Seeded ESSL and Hikvision Biometric devices.');
  }

  // 12. Audit Logs
  const checkAudit = db.prepare('SELECT COUNT(*) as count FROM audit_logs').get();
  if (checkAudit.count === 0) {
    const insertAudit = db.prepare(`
      INSERT INTO audit_logs (institution_id, username, role, module, action, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertAudit.run(1, 'admin', 'Admin', 'Authentication', 'LOGIN', 'Admin logged in successfully from campus workstation', '192.168.1.15');
    insertAudit.run(1, 'clerk', 'Clerk', 'Student Module', 'CREATE', 'Created student record for Vikram Belhekar (ENR-24-00101)', '192.168.1.42');
    insertAudit.run(1, 'account', 'Account', 'Finance', 'FEE_RECEIPT', 'Issued fee receipt REC-2025-00101 of amount Rs. 41,100', '192.168.1.33');
    insertAudit.run(1, 'faculty', 'Faculty', 'Examination', 'MARKS_ENTRY', 'Updated K3/K5/K6 internal marks for MBA Marketing batch', '192.168.1.75');
    console.log('✅ Seeded Audit logs.');
  }

  // 13. Sync to MongoDB (Mongoose)
  syncToMongoDB();

  console.log('🎉 Belhekar ERP Database seeding completed flawlessly!');
}

async function syncToMongoDB() {
  try {
    const mongo = require('./mongo');
    if (!mongo || !mongo.mongoose || mongo.mongoose.connection.readyState !== 1) {
      console.log('ℹ️ MongoDB connection not active yet, skipping Mongoose sync.');
      return;
    }

    const instCount = await mongo.Institution.countDocuments();
    if (instCount === 0) {
      console.log('🍃 Syncing SQLite dataset to MongoDB Mongoose collections...');
      const insts = db.prepare('SELECT * FROM institutions').all();
      await mongo.Institution.insertMany(insts);

      const users = db.prepare('SELECT * FROM users').all();
      await mongo.User.insertMany(users);

      const students = db.prepare('SELECT * FROM students').all();
      await mongo.Student.insertMany(students);

      const faculty = db.prepare('SELECT * FROM faculty').all();
      await mongo.Faculty.insertMany(faculty);

      const feePayments = db.prepare('SELECT * FROM fee_payments').all();
      await mongo.FeePayment.insertMany(feePayments);

      const expenditures = db.prepare('SELECT * FROM expenditures').all();
      await mongo.Expenditure.insertMany(expenditures);

      const storeInv = db.prepare('SELECT * FROM store_inventory').all();
      await mongo.StoreInventory.insertMany(storeInv);

      const libBooks = db.prepare('SELECT * FROM library_books').all();
      await mongo.LibraryBook.insertMany(libBooks);

      console.log('✅ MongoDB Mongoose collections populated successfully!');
    }
  } catch (err) {
    console.warn('MongoDB sync note:', err.message);
  }
}

seedDatabase();

