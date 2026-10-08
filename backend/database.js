const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'erp.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS institutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      short_name TEXT NOT NULL,
      category TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL, -- Admin, Principal, Clerk, Faculty, Account, Store, Librarian
      designation TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      application_id TEXT,
      enrollment_no TEXT UNIQUE NOT NULL,
      abc_id TEXT,
      department TEXT NOT NULL,
      admission_year TEXT NOT NULL,
      current_year TEXT NOT NULL,
      full_name TEXT NOT NULL,
      dob DATE,
      gender TEXT,
      category TEXT,
      cap_type TEXT,
      birth_place TEXT,
      father_name TEXT,
      mother_name TEXT,
      mobile_no TEXT,
      parent_mobile TEXT,
      address TEXT,
      email TEXT,
      aadhar_no TEXT,
      photo_url TEXT,
      registration_fee REAL DEFAULT 0,
      tuition_fee REAL DEFAULT 0,
      development_fee REAL DEFAULT 0,
      exam_fee REAL DEFAULT 0,
      other_fee REAL DEFAULT 0,
      is_scholarship_eligible INTEGER DEFAULT 0, -- 1 = Yes, 0 = No
      scholarship_inst1_status TEXT DEFAULT 'Pending', -- Pending, Received, Adjusted
      scholarship_inst2_status TEXT DEFAULT 'Pending',
      status TEXT DEFAULT 'Active', -- Active, Graduated, Left
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS faculty (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      dob DATE,
      gender TEXT,
      category TEXT,
      father_name TEXT,
      mother_name TEXT,
      year_of_joining TEXT,
      department TEXT NOT NULL,
      designation TEXT NOT NULL,
      qualification TEXT,
      email TEXT UNIQUE NOT NULL,
      mobile_no TEXT,
      emergency_mobile TEXT,
      address TEXT,
      pan_no TEXT,
      aadhar_no TEXT,
      abc_id TEXT,
      bank_account_no TEXT,
      bank_ifsc TEXT,
      bank_branch TEXT,
      base_salary REAL DEFAULT 0,
      photo_url TEXT,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS student_attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      date DATE NOT NULL,
      status TEXT NOT NULL, -- Present, Absent
      in_time TEXT,
      out_time TEXT,
      duration_minutes INTEGER DEFAULT 0,
      source TEXT DEFAULT 'Manual', -- Manual, ESSL Biometric, Hikvision Biometric
      subject TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS faculty_attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      faculty_id INTEGER NOT NULL,
      date DATE NOT NULL,
      status TEXT NOT NULL, -- Present, Absent, Half-Day, On Leave
      in_time TEXT,
      out_time TEXT,
      duration_minutes INTEGER DEFAULT 0,
      source TEXT DEFAULT 'Manual', -- Manual, ESSL Biometric, Hikvision Biometric
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
      FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS internal_marks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      department TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      subject TEXT NOT NULL,
      k3_score REAL DEFAULT 0, -- Knowledge Level 3
      k5_score REAL DEFAULT 0, -- Knowledge Level 5
      k6_score REAL DEFAULT 0, -- Knowledge Level 6
      max_k3 REAL DEFAULT 20,
      max_k5 REAL DEFAULT 20,
      max_k6 REAL DEFAULT 20,
      total_score REAL DEFAULT 0,
      max_total REAL DEFAULT 60,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS placement_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      student_id INTEGER,
      student_name TEXT NOT NULL,
      enrollment_no TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      department TEXT NOT NULL,
      company_name TEXT NOT NULL,
      ctc_package_lpa REAL NOT NULL,
      designation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS alumni_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      student_id INTEGER,
      student_name TEXT NOT NULL,
      enrollment_no TEXT NOT NULL,
      passing_year TEXT NOT NULL,
      department TEXT NOT NULL,
      current_company TEXT,
      current_designation TEXT,
      ctc_lpa REAL,
      higher_studies TEXT,
      email TEXT,
      mobile_no TEXT,
      city TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fee_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      receipt_no TEXT UNIQUE NOT NULL,
      student_id INTEGER NOT NULL,
      payment_date DATE NOT NULL,
      tuition_fee REAL DEFAULT 0,
      development_fee REAL DEFAULT 0,
      exam_fee REAL DEFAULT 0,
      registration_fee REAL DEFAULT 0,
      bonafide_fee REAL DEFAULT 0,
      form15a_fee REAL DEFAULT 0,
      lc_fee REAL DEFAULT 0,
      hostel_fee REAL DEFAULT 0,
      transport_fee REAL DEFAULT 0,
      other_fee REAL DEFAULT 0,
      scholarship_adjusted REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_mode TEXT NOT NULL, -- Cash, Cheque, UPI, Net Banking
      ref_transaction_no TEXT,
      remarks TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS expenditures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      voucher_no TEXT UNIQUE NOT NULL,
      payment_date DATE NOT NULL,
      category TEXT NOT NULL, -- Staff Payroll, Petty Cash Voucher, Bank Cheque, Vendor Bill
      payee_name TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_mode TEXT NOT NULL, -- Bank Cheque, Cash, NEFT/RTGS, UPI
      cheque_no TEXT,
      description TEXT,
      approved_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS store_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      supplier_name TEXT NOT NULL,
      receipt_date DATE NOT NULL,
      material_name TEXT NOT NULL,
      category TEXT,
      unit TEXT DEFAULT 'Nos',
      received_qty REAL NOT NULL,
      rate REAL NOT NULL,
      total_cost REAL NOT NULL,
      available_qty REAL NOT NULL,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS store_distributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      distribution_date DATE NOT NULL,
      recipient_name TEXT NOT NULL,
      recipient_type TEXT, -- Person, Department, College/School
      target_institution TEXT,
      department TEXT,
      distributed_qty REAL NOT NULL,
      remaining_qty REAL NOT NULL,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
      FOREIGN KEY (item_id) REFERENCES store_inventory(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS library_books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      accession_no TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      publisher TEXT,
      edition TEXT,
      category TEXT,
      shelf_location TEXT,
      total_copies INTEGER DEFAULT 1,
      available_copies INTEGER DEFAULT 1,
      price REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS library_journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      accession_no TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      issn TEXT,
      publisher TEXT,
      frequency TEXT,
      volume_issue TEXT,
      subscription_year TEXT,
      shelf_location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS library_circulation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      item_type TEXT NOT NULL, -- Book, Journal
      item_id INTEGER NOT NULL,
      borrower_type TEXT NOT NULL, -- Student, Faculty
      borrower_id INTEGER NOT NULL,
      issue_date DATE NOT NULL,
      due_date DATE NOT NULL,
      return_date DATE,
      fine_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'Issued', -- Issued, Returned, Overdue
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS generated_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      doc_type TEXT NOT NULL, -- Bonafide, LC, 15A, Validity Letter
      serial_no TEXT UNIQUE NOT NULL,
      issue_date DATE NOT NULL,
      academic_year TEXT,
      payload_json TEXT, -- All custom editable fields
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution_id INTEGER,
      username TEXT NOT NULL,
      role TEXT NOT NULL,
      module TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS biometric_devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL, -- ESSL, Hikvision
      ip_address TEXT NOT NULL,
      port INTEGER DEFAULT 4370,
      location TEXT,
      status TEXT DEFAULT 'Online', -- Online, Offline, Syncing
      last_sync DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ SQLite Schema initialized successfully.');
}

initSchema();

module.exports = db;
