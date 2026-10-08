const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/belhekar_erp';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 Connected to MongoDB via Mongoose successfully.'))
  .catch(err => console.warn('⚠️ MongoDB connection note:', err.message));

// 1. Institution Schema
const InstitutionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  short_name: { type: String, required: true },
  category: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 2. User Schema
const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, default: 1 },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  designation: { type: String },
  avatar: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 3. Student Schema
const StudentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  application_id: { type: String },
  enrollment_no: { type: String, required: true, unique: true },
  abc_id: { type: String },
  department: { type: String, required: true },
  admission_year: { type: String, required: true },
  current_year: { type: String, required: true },
  full_name: { type: String, required: true },
  dob: { type: String },
  gender: { type: String },
  category: { type: String },
  cap_type: { type: String },
  birth_place: { type: String },
  father_name: { type: String },
  mother_name: { type: String },
  mobile_no: { type: String },
  parent_mobile: { type: String },
  address: { type: String },
  email: { type: String },
  aadhar_no: { type: String },
  photo_url: { type: String },
  registration_fee: { type: Number, default: 0 },
  tuition_fee: { type: Number, default: 0 },
  development_fee: { type: Number, default: 0 },
  exam_fee: { type: Number, default: 0 },
  other_fee: { type: Number, default: 0 },
  is_scholarship_eligible: { type: Number, default: 0 },
  scholarship_inst1_status: { type: String, default: 'Pending' },
  scholarship_inst2_status: { type: String, default: 'Pending' },
  status: { type: String, default: 'Active' },
  created_at: { type: Date, default: Date.now }
});

// 4. Faculty Schema
const FacultySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  full_name: { type: String, required: true },
  dob: { type: String },
  gender: { type: String },
  category: { type: String },
  father_name: { type: String },
  mother_name: { type: String },
  year_of_joining: { type: String },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String },
  email: { type: String, required: true },
  mobile_no: { type: String },
  emergency_mobile: { type: String },
  address: { type: String },
  pan_no: { type: String },
  aadhar_no: { type: String },
  abc_id: { type: String },
  bank_account_no: { type: String },
  bank_ifsc: { type: String },
  bank_branch: { type: String },
  base_salary: { type: Number, default: 0 },
  photo_url: { type: String },
  status: { type: String, default: 'Active' },
  created_at: { type: Date, default: Date.now }
});

// 5. Student Attendance Schema
const StudentAttendanceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  student_id: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  in_time: { type: String },
  out_time: { type: String },
  duration_minutes: { type: Number, default: 0 },
  source: { type: String, default: 'Manual' },
  subject: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 6. Faculty Attendance Schema
const FacultyAttendanceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  faculty_id: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  in_time: { type: String },
  out_time: { type: String },
  duration_minutes: { type: Number, default: 0 },
  source: { type: String, default: 'Manual' },
  created_at: { type: Date, default: Date.now }
});

// 7. Internal Marks Schema
const InternalMarksSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  student_id: { type: Number, required: true },
  department: { type: String, required: true },
  academic_year: { type: String, required: true },
  subject: { type: String, required: true },
  k3_score: { type: Number, default: 0 },
  k5_score: { type: Number, default: 0 },
  k6_score: { type: Number, default: 0 },
  max_k3: { type: Number, default: 20 },
  max_k5: { type: Number, default: 20 },
  max_k6: { type: Number, default: 20 },
  total_score: { type: Number, default: 0 },
  max_total: { type: Number, default: 60 },
  remarks: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 8. Placement Record Schema
const PlacementRecordSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  student_id: { type: Number },
  student_name: { type: String, required: true },
  enrollment_no: { type: String, required: true },
  academic_year: { type: String, required: true },
  department: { type: String, required: true },
  company_name: { type: String, required: true },
  ctc_package_lpa: { type: Number, required: true },
  designation: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 9. Alumni Record Schema
const AlumniRecordSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  student_id: { type: Number },
  student_name: { type: String, required: true },
  enrollment_no: { type: String, required: true },
  passing_year: { type: String, required: true },
  department: { type: String, required: true },
  current_company: { type: String },
  current_designation: { type: String },
  ctc_lpa: { type: Number },
  higher_studies: { type: String },
  email: { type: String },
  mobile_no: { type: String },
  city: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 10. Fee Payment Schema
const FeePaymentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  receipt_no: { type: String, required: true, unique: true },
  student_id: { type: Number, required: true },
  payment_date: { type: String, required: true },
  tuition_fee: { type: Number, default: 0 },
  development_fee: { type: Number, default: 0 },
  exam_fee: { type: Number, default: 0 },
  registration_fee: { type: Number, default: 0 },
  bonafide_fee: { type: Number, default: 0 },
  form15a_fee: { type: Number, default: 0 },
  lc_fee: { type: Number, default: 0 },
  hostel_fee: { type: Number, default: 0 },
  transport_fee: { type: Number, default: 0 },
  other_fee: { type: Number, default: 0 },
  scholarship_adjusted: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  payment_mode: { type: String, required: true },
  ref_transaction_no: { type: String },
  remarks: { type: String },
  created_by: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 11. Expenditure Schema
const ExpenditureSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  voucher_no: { type: String, required: true, unique: true },
  payment_date: { type: String, required: true },
  category: { type: String, required: true },
  payee_name: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_mode: { type: String, required: true },
  cheque_no: { type: String },
  description: { type: String },
  approved_by: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 12. Store Inventory Schema
const StoreInventorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  supplier_name: { type: String, required: true },
  receipt_date: { type: String, required: true },
  material_name: { type: String, required: true },
  category: { type: String },
  unit: { type: String, default: 'Nos' },
  received_qty: { type: Number, required: true },
  rate: { type: Number, required: true },
  total_cost: { type: Number, required: true },
  available_qty: { type: Number, required: true },
  location: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 13. Store Distribution Schema
const StoreDistributionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  item_id: { type: Number, required: true },
  distribution_date: { type: String, required: true },
  recipient_name: { type: String, required: true },
  recipient_type: { type: String },
  target_institution: { type: String },
  department: { type: String },
  distributed_qty: { type: Number, required: true },
  remaining_qty: { type: Number, required: true },
  remarks: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 14. Library Book Schema
const LibraryBookSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  accession_no: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String },
  edition: { type: String },
  category: { type: String },
  shelf_location: { type: String },
  total_copies: { type: Number, default: 1 },
  available_copies: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

// 15. Library Journal Schema
const LibraryJournalSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  accession_no: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  issn: { type: String },
  publisher: { type: String },
  frequency: { type: String },
  volume_issue: { type: String },
  subscription_year: { type: String },
  shelf_location: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 16. Library Circulation Schema
const LibraryCirculationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  item_type: { type: String, required: true },
  item_id: { type: Number, required: true },
  borrower_type: { type: String, required: true },
  borrower_id: { type: Number, required: true },
  issue_date: { type: String, required: true },
  due_date: { type: String, required: true },
  return_date: { type: String },
  fine_amount: { type: Number, default: 0 },
  status: { type: String, default: 'Issued' },
  created_at: { type: Date, default: Date.now }
});

// 17. Generated Document Schema
const GeneratedDocumentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number, required: true },
  student_id: { type: Number, required: true },
  doc_type: { type: String, required: true },
  serial_no: { type: String, required: true, unique: true },
  issue_date: { type: String, required: true },
  academic_year: { type: String },
  payload_json: { type: String },
  created_by: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 18. Audit Log Schema
const AuditLogSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  institution_id: { type: Number },
  username: { type: String, required: true },
  role: { type: String, required: true },
  module: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  ip_address: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Models Export
const Institution = mongoose.models.Institution || mongoose.model('Institution', InstitutionSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
const StudentAttendance = mongoose.models.StudentAttendance || mongoose.model('StudentAttendance', StudentAttendanceSchema);
const FacultyAttendance = mongoose.models.FacultyAttendance || mongoose.model('FacultyAttendance', FacultyAttendanceSchema);
const InternalMarks = mongoose.models.InternalMarks || mongoose.model('InternalMarks', InternalMarksSchema);
const PlacementRecord = mongoose.models.PlacementRecord || mongoose.model('PlacementRecord', PlacementRecordSchema);
const AlumniRecord = mongoose.models.AlumniRecord || mongoose.model('AlumniRecord', AlumniRecordSchema);
const FeePayment = mongoose.models.FeePayment || mongoose.model('FeePayment', FeePaymentSchema);
const Expenditure = mongoose.models.Expenditure || mongoose.model('Expenditure', ExpenditureSchema);
const StoreInventory = mongoose.models.StoreInventory || mongoose.model('StoreInventory', StoreInventorySchema);
const StoreDistribution = mongoose.models.StoreDistribution || mongoose.model('StoreDistribution', StoreDistributionSchema);
const LibraryBook = mongoose.models.LibraryBook || mongoose.model('LibraryBook', LibraryBookSchema);
const LibraryJournal = mongoose.models.LibraryJournal || mongoose.model('LibraryJournal', LibraryJournalSchema);
const LibraryCirculation = mongoose.models.LibraryCirculation || mongoose.model('LibraryCirculation', LibraryCirculationSchema);
const GeneratedDocument = mongoose.models.GeneratedDocument || mongoose.model('GeneratedDocument', GeneratedDocumentSchema);
const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

module.exports = {
  mongoose,
  Institution,
  User,
  Student,
  Faculty,
  StudentAttendance,
  FacultyAttendance,
  InternalMarks,
  PlacementRecord,
  AlumniRecord,
  FeePayment,
  Expenditure,
  StoreInventory,
  StoreDistribution,
  LibraryBook,
  LibraryJournal,
  LibraryCirculation,
  GeneratedDocument,
  AuditLog
};
