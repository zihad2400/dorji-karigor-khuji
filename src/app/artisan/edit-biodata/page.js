'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import "react-datepicker/dist/react-datepicker.css";
import { 
  FiUser, FiMapPin, FiBookOpen, FiUsers, FiBriefcase, FiShield, FiPhone, 
  FiSave, FiChevronRight, FiChevronLeft, FiCheck, FiAward, FiFileText, 
  FiCoffee, FiLayers
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/components/ui/CustomToast';

// ==================== বাংলাদেশের জেলা ও বিভাগ ====================
const DISTRICTS_DATA = {
  "ঢাকা": ["ঢাকা", "গাজীপুর", "কিশোরগঞ্জ", "মানিকগঞ্জ", "মুন্সিগঞ্জ", "নারায়ণগঞ্জ", "নরসিংদী", "টাঙ্গাইল", "ফরিদপুর", "গোপালগঞ্জ", "মাদারীপুর", "রাজবাড়ী", "শরীয়তপুর"],
  "চট্টগ্রাম": ["চট্টগ্রাম", "কক্সবাজার", "কুমিল্লা", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "ফেনী", "খাগড়াছড়ি", "লক্ষ্মীপুর", "নোয়াখালী", "রাঙামাটি", "বান্দরবান"],
  "রাজশাহী": ["রাজশাহী", "বগুড়া", "জয়পুরহাট", "নওগাঁ", "নাটোর", "চাঁপাইনবাবগঞ্জ", "পাবনা", "সিরাজগঞ্জ"],
  "খুলনা": ["খুলনা", "বাগেরহাট", "চুয়াডাঙ্গা", "যশোর", "ঝিনাইদহ", "কুষ্টিয়া", "মাগুরা", "মেহেরপুর", "নড়াইল", "সাতক্ষীরা"],
  "বরিশাল": ["বরিশাল", "বরগুনা", "ভোলা", "ঝালকাঠি", "পটুয়াখালী", "পিরোজপুর"],
  "সিলেট": ["সিলেট", "হবিগঞ্জ", "মৌলভীবাজার", "সুনামগঞ্জ"],
  "রংপুর": ["রংপুর", "দিনাজপুর", "গাইবান্ধা", "কুড়িগ্রাম", "লালমনিরহাট", "নীলফামারী", "পঞ্চগড়", "ঠাকুরগাঁও"],
  "ময়মনসিংহ": ["ময়মনসিংহ", "জামালপুর", "নেত্রকোনা", "শেরপুর"]
};

const DIVISIONS = Object.keys(DISTRICTS_DATA);

// সব ৬৪টি জেলা একসাথে
const ALL_DISTRICTS = [
  "ঢাকা",
  "গাজীপুর",
  "কিশোরগঞ্জ",
  "মানিকগঞ্জ",
  "মুন্সিগঞ্জ",
  "নারায়ণগঞ্জ",
  "নরসিংদী",
  "টাঙ্গাইল",
  "ফরিদপুর",
  "গোপালগঞ্জ",
  "মাদারীপুর",
  "রাজবাড়ী",
  "শরীয়তপুর",
  "চট্টগ্রাম",
  "কক্সবাজার",
  "কুমিল্লা",
  "ব্রাহ্মণবাড়িয়া",
  "চাঁদপুর",
  "ফেনী",
  "খাগড়াছড়ি",
  "লক্ষ্মীপুর",
  "নোয়াখালী",
  "রাঙামাটি",
  "বান্দরবান",
  "রাজশাহী",
  "বগুড়া",
  "জয়পুরহাট",
  "নওগাঁ",
  "নাটোর",
  "চাঁপাইনবাবগঞ্জ",
  "পাবনা",
  "সিরাজগঞ্জ",
  "খুলনা",
  "বাগেরহাট",
  "চুয়াডাঙ্গা",
  "যশোর",
  "ঝিনাইদহ",
  "কুষ্টিয়া",
  "মাগুরা",
  "মেহেরপুর",
  "নড়াইল",
  "সাতক্ষীরা",
  "বরিশাল",
  "বরগুনা",
  "ভোলা",
  "ঝালকাঠি",
  "পটুয়াখালী",
  "পিরোজপুর",
  "সিলেট",
  "হবিগঞ্জ",
  "মৌলভীবাজার",
  "সুনামগঞ্জ",
  "রংপুর",
  "দিনাজপুর",
  "গাইবান্ধা",
  "কুড়িগ্রাম",
  "লালমনিরহাট",
  "নীলফামারী",
  "পঞ্চগড়",
  "ঠাকুরগাঁও",
  "ময়মনসিংহ",
  "জামালপুর",
  "নেত্রকোনা",
  "শেরপুর"
];
// ================================================================

const DatePicker = dynamic(() => import('react-datepicker'), { 
  ssr: false,
  loading: () => <div className="w-full bg-background border border-gray-700 rounded-lg p-3 text-text-secondary">লোড হচ্ছে...</div>
});

const allCategories = [
  'পাঞ্জাবি দর্জি', 'শার্ট দর্জি', 'প্যান্ট দর্জি', 'কাটিং মাস্টার', 
  'সুইং অপারেটর', 'এমব্রয়ডারি', 'বুটিক ওয়ার্কার', 'কোয়ালিটি কন্ট্রোলার',
  'Arabian ডিজাইন', 'ব্লেজার স্পেশালিস্ট', 'শেরওয়ানি দর্জি', 'থ্রি-পিস দর্জি',
  'কামিজ দর্জি', 'কোট দর্জি', 'প্যাটার্ন মেকার', 'ওভারলক অপারেটর'
];

const educationLevels = ['PSC', 'JSC', 'SSC', 'HSC', 'Diploma', 'Graduation', 'Masters', 'NO'];
const maritalStatusOptions = ['অবিবাহিত', 'বিবাহিত'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const steps = [
  { id: 1, name: 'সাধারণ তথ্য', icon: <FiUser /> },
  { id: 2, name: 'ঠিকানা', icon: <FiMapPin /> },
  { id: 3, name: 'শিক্ষাগত যোগ্যতা', icon: <FiBookOpen /> },
  { id: 4, name: 'পারিবারিক তথ্য', icon: <FiUsers /> },
  { id: 5, name: 'ব্যক্তিগত তথ্য', icon: <FiUser /> },
  { id: 6, name: 'দক্ষতা ও অভিজ্ঞতা', icon: <FiAward /> },
  { id: 7, name: 'রেফারেন্স', icon: <FiFileText /> },
  { id: 8, name: 'অঙ্গীকারনামা', icon: <FiShield /> },
  { id: 9, name: 'যোগাযোগ', icon: <FiPhone /> },
];

export default function EditBiodataPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [maxDate, setMaxDate] = useState(null);

  const [declarations, setDeclarations] = useState({
    knowFamily: null,
    trueInfo: null,
  });

  const [formData, setFormData] = useState({
    fullName: '', mobileNumber: '', dob: null, gender: '', 
    selectedCategories: [],
    permanentDivision: '', permanentDistrict: '', permanentAddress: '',
    currentDivision: '', currentDistrict: '', currentAddress: '',
    educationLevels: [], institutionName: '', passingYear: '',
    fatherName: '', motherName: '',
    maritalStatus: [], bloodGroup: [], height: '', weight: '', religion: '',
    skillDetails: '', machineExperience: '', productionCapacity: '',
    accommodationRequired: '', foodRequired: '',
    referenceName: '', referencePhone: '',
    contactEmail: '',
  });

  useEffect(() => {
    setMounted(true);
    setMaxDate(new Date());

    const fetchProfile = async () => {
      try {
        const savedDraft = localStorage.getItem('biodata_draft');
        let localData = {};
        if (savedDraft) {
          try { localData = JSON.parse(savedDraft); } catch (e) {}
        }

        const res = await fetch('/api/artisan/profile');
        let dbData = {};
        if (res.ok) {
          const data = await res.json();
          if (data.profile) dbData = data.profile;
        }

        setFormData(prev => ({ ...prev, ...localData, ...dbData }));

        const savedDeclarations = localStorage.getItem('biodata_declarations');
        if (savedDeclarations) {
          setDeclarations(JSON.parse(savedDeclarations));
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    localStorage.setItem('biodata_draft', JSON.stringify(newData));
  };

  const toggleArrayItem = (field, value) => {
    const current = formData[field] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    const newData = { ...formData, [field]: updated };
    setFormData(newData);
    localStorage.setItem('biodata_draft', JSON.stringify(newData));
  };

  const toggleCategory = (category) => toggleArrayItem('selectedCategories', category);
  const toggleEducation = (level) => toggleArrayItem('educationLevels', level);

  const handleDateChange = (date) => {
    const newData = { ...formData, dob: date };
    setFormData(newData);
    localStorage.setItem('biodata_draft', JSON.stringify(newData));
  };

  const handleDeclarationChange = (field, value) => {
    const newDeclarations = { ...declarations, [field]: value };
    setDeclarations(newDeclarations);
    localStorage.setItem('biodata_declarations', JSON.stringify(newDeclarations));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => { 
    if (currentStep > 1) setCurrentStep(currentStep - 1); 
  };

  const handleSubmit = async () => {
    if (declarations.knowFamily !== 'yes' || declarations.trueInfo !== 'yes') {
      showToast('সাবমিট করার জন্য সব শর্তে "হ্যাঁ" নির্বাচন করতে হবে।', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/artisan/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('বায়োডাটা সাবমিট হয়েছে', 'success');
        localStorage.removeItem('biodata_draft');
        localStorage.removeItem('biodata_declarations');
        setTimeout(() => router.push('/artisan/dashboard'), 1500);
      } else {
        throw new Error('সাবমিট ব্যর্থ হয়েছে');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-background border border-gray-700 rounded-lg p-3 text-text-primary focus:border-primary focus:outline-none transition";
  const labelClass = "block text-sm text-text-secondary mb-2";

  if (fetching) return <div className="p-8 text-center text-text-secondary">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      
      {/* সাইডবার */}
      <div className="w-full lg:w-64 bg-surface rounded-2xl border border-gray-800 p-6 flex-shrink-0">
        <div className="relative">
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-800 -z-0"></div>
          
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            
            return (
              <div key={step.id} className="relative z-10 flex items-center justify-end gap-4 mb-8 last:mb-0">
                <span className={`text-sm text-right flex-grow transition-colors ${
                  isActive ? 'text-primary-light font-bold' : 
                  isCompleted ? 'text-green-400 font-medium' : 'text-text-secondary'
                }`}>
                  {step.name}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0 transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/50 scale-110' 
                    : isCompleted 
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-background border-gray-700 text-text-secondary'
                }`}>
                  {isCompleted && !isActive ? <FiCheck size={16} /> : step.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ফর্ম */}
      <div className="flex-grow bg-surface rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 bg-surfaceHover/30 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">বায়োডাটা তৈরি করুন</h1>
            <p className="text-text-secondary text-sm mt-1">{steps[currentStep-1].name}</p>
          </div>
          <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded flex items-center gap-1">
            <FiSave size={12} /> অটো সেভ চালু
          </span>
        </div>

        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              
              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">সাধারণ তথ্য</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className={labelClass}>পূর্ণ নাম <span className="text-red-500">*</span></label><input name="fullName" value={formData.fullName || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>মোবাইল নম্বর <span className="text-red-500">*</span></label><input name="mobileNumber" value={formData.mobileNumber || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                    <div>
                      <label className={labelClass}>জন্ম তারিখ</label>
                      {mounted ? <DatePicker selected={formData.dob ? new Date(formData.dob) : null} onChange={handleDateChange} dateFormat="dd/MM/yyyy" placeholderText="তারিখ নির্বাচন করুন" className={inputClass} showYearDropdown scrollableYearDropdown yearDropdownItemNumber={50} maxDate={maxDate} /> : <div className="w-full bg-background border border-gray-700 rounded-lg p-3 text-text-secondary">লোড হচ্ছে...</div>}
                    </div>
                    <div>
                      <label className={labelClass}>লিঙ্গ <span className="text-red-500">*</span></label>
                      <select name="gender" value={formData.gender || ''} onChange={handleChange} className={inputClass}>
                        <option value="">নির্বাচন করুন</option>
                        <option value="male">পুরুষ</option>
                        <option value="female">মহিলা</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <FiLayers className="text-primary-light" /> আপনার কাজের ক্যাটাগরি 
                      <span className="text-sm font-normal text-primary-light bg-primary/10 px-2 py-0.5 rounded">{formData.selectedCategories?.length || 0} টি নির্বাচিত</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {allCategories.map((cat) => {
                        const isSelected = formData.selectedCategories?.includes(cat);
                        return (
                          <div key={cat} onClick={() => toggleCategory(cat)} className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition ${isSelected ? 'bg-primary/10 border-primary text-primary-light' : 'bg-background border-gray-700 text-text-secondary hover:border-gray-500'}`}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary border-primary text-white' : 'border-gray-600'}`}>{isSelected && <FiCheck size={14} />}</div>
                            <span className="text-sm truncate">{cat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== Step 2: ঠিকানা (সংশোধিত) ===== */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">ঠিকানার তথ্য</h2>
                  
                  {/* স্থায়ী ঠিকানা */}
                  <div className="bg-background rounded-xl border border-gray-800 p-4 space-y-4">
                    <h3 className="text-primary-light font-medium text-sm border-b border-gray-700 pb-2">স্থায়ী ঠিকানা</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>বিভাগ</label>
                        <select 
                          name="permanentDivision" 
                          value={formData.permanentDivision || ''} 
                          onChange={(e) => {
                            const newData = { 
                              ...formData, 
                              permanentDivision: e.target.value,
                              permanentDistrict: ''
                            };
                            setFormData(newData);
                            localStorage.setItem('biodata_draft', JSON.stringify(newData));
                          }} 
                          className={inputClass}
                        >
                          <option value="">বিভাগ নির্বাচন করুন</option>
                          {DIVISIONS.map(div => (
                            <option key={div} value={div}>{div}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className={labelClass}>জেলা</label>
                        <select 
                          name="permanentDistrict" 
                          value={formData.permanentDistrict || ''} 
                          onChange={handleChange} 
                          className={inputClass}
                        >
                          <option value="">জেলা নির্বাচন করুন</option>
                          {ALL_DISTRICTS.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className={labelClass}>বিস্তারিত ঠিকানা</label>
                      <input 
                        name="permanentAddress" 
                        value={formData.permanentAddress || ''} 
                        onChange={handleChange} 
                        type="text" 
                        className={inputClass} 
                        placeholder="গ্রাম/বাসা নম্বর, রোড, থানা" 
                      />
                    </div>
                  </div>

                  {/* বর্তমান ঠিকানা */}
                  <div className="bg-background rounded-xl border border-gray-800 p-4 space-y-4">
                    <h3 className="text-primary-light font-medium text-sm border-b border-gray-700 pb-2">বর্তমান ঠিকানা</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>বিভাগ</label>
                        <select 
                          name="currentDivision" 
                          value={formData.currentDivision || ''} 
                          onChange={(e) => {
                            const newData = { 
                              ...formData, 
                              currentDivision: e.target.value,
                              currentDistrict: ''
                            };
                            setFormData(newData);
                            localStorage.setItem('biodata_draft', JSON.stringify(newData));
                          }} 
                          className={inputClass}
                        >
                          <option value="">বিভাগ নির্বাচন করুন</option>
                          {DIVISIONS.map(div => (
                            <option key={div} value={div}>{div}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className={labelClass}>জেলা</label>
                        <select 
                          name="currentDistrict" 
                          value={formData.currentDistrict || ''} 
                          onChange={handleChange} 
                          className={inputClass}
                        >
                          <option value="">জেলা নির্বাচন করুন</option>
                          {ALL_DISTRICTS.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className={labelClass}>বিস্তারিত ঠিকানা</label>
                      <input 
                        name="currentAddress" 
                        value={formData.currentAddress || ''} 
                        onChange={handleChange} 
                        type="text" 
                        className={inputClass} 
                        placeholder="গ্রাম/বাসা নম্বর, রোড, থানা" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">শিক্ষাগত যোগ্যতা</h2>
                  <div>
                    <label className={labelClass}>আপনার শিক্ষাগত যোগ্যতা (একাধিক নির্বাচন করুন)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {educationLevels.map((level) => {
                        const isSelected = formData.educationLevels?.includes(level);
                        return (
                          <div key={level} onClick={() => toggleEducation(level)} className={`p-3 rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition ${isSelected ? 'bg-primary/10 border-primary text-primary-light font-bold' : 'bg-background border-gray-700 text-text-secondary hover:border-gray-500'}`}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary border-primary text-white' : 'border-gray-600'}`}>{isSelected && <FiCheck size={14} />}</div>
                            <span className="text-sm">{level}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className={labelClass}>প্রতিষ্ঠানের নাম</label><input name="institutionName" value={formData.institutionName || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>পাসের সাল</label><input name="passingYear" value={formData.passingYear || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">পারিবারিক তথ্য</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className={labelClass}>পিতার নাম</label><input name="fatherName" value={formData.fatherName || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>মাতার নাম</label><input name="motherName" value={formData.motherName || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">ব্যক্তিগত তথ্য</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* বৈবাহিক অবস্থা */}
                    <div>
                      <label className={labelClass}>বৈবাহিক অবস্থা</label>
                      <div className="grid grid-cols-2 gap-3">
                        {maritalStatusOptions.map((status) => {
                          const isSelected = formData.maritalStatus?.includes(status);
                          return (
                            <div 
                              key={status} 
                              onClick={() => toggleArrayItem('maritalStatus', status)} 
                              className={`p-3 rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition ${
                                isSelected 
                                  ? 'bg-primary/10 border-primary text-primary-light font-bold' 
                                  : 'bg-background border-gray-700 text-text-secondary hover:border-gray-500'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-primary border-primary text-white' : 'border-gray-600'
                              }`}>
                                {isSelected && <FiCheck size={14} />}
                              </div>
                              <span className="text-sm">{status}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ধর্ম */}
                    <div>
                      <label className={labelClass}>ধর্ম</label>
                      <select 
                        name="religion" 
                        value={formData.religion || ''} 
                        onChange={handleChange} 
                        className={inputClass}
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="ইসলাম">ইসলাম</option>
                        <option value="হিন্দু">হিন্দু</option>
                        <option value="বৌদ্ধ">বৌদ্ধ</option>
                        <option value="খ্রিস্টান">খ্রিস্টান</option>
                        <option value="অন্যান্য">অন্যান্য</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6 */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">দক্ষতা ও অভিজ্ঞতা</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2"><label className={labelClass}>দক্ষতার বিস্তারিত</label><textarea name="skillDetails" value={formData.skillDetails || ''} onChange={handleChange} rows="2" className={inputClass}></textarea></div>
                    <div><label className={labelClass}>মেশিন অভিজ্ঞতা</label><input name="machineExperience" value={formData.machineExperience || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>প্রোডাকশন ক্যাপাসিটি</label><input name="productionCapacity" value={formData.productionCapacity || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                  </div>
                </div>
              )}

              {/* Step 7 */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">রেফারেন্স</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className={labelClass}>নাম</label><input name="referenceName" value={formData.referenceName || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>ফোন</label><input name="referencePhone" value={formData.referencePhone || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                  </div>
                </div>
              )}

              {/* Step 9 */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2"><FiShield className="text-primary-light" /> অঙ্গীকারনামা</h2>
                  <div className="bg-background rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-5 border-b border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <p className="text-sm text-text-primary">ওয়েবসাইটে বায়োডাটা জমা দিচ্ছেন, তা আপনার অভিভাবক জানেন?</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeclarationChange('knowFamily', 'yes')} className={`px-6 py-2 rounded-lg text-sm font-medium border transition ${declarations.knowFamily === 'yes' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-surface border-gray-600 text-text-secondary'}`}>হ্যাঁ</button>
                        <button onClick={() => handleDeclarationChange('knowFamily', 'no')} className={`px-6 py-2 rounded-lg text-sm font-medium border transition ${declarations.knowFamily === 'no' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-surface border-gray-600 text-text-secondary'}`}>না</button>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <p className="text-sm text-text-primary">আল্লাহর শপথ করে সাক্ষ্য দিন, যে তথ্যগুলো দিয়েছেন সব সত্য?</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeclarationChange('trueInfo', 'yes')} className={`px-6 py-2 rounded-lg text-sm font-medium border transition ${declarations.trueInfo === 'yes' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-surface border-gray-600 text-text-secondary'}`}>হ্যাঁ</button>
                        <button onClick={() => handleDeclarationChange('trueInfo', 'no')} className={`px-6 py-2 rounded-lg text-sm font-medium border transition ${declarations.trueInfo === 'no' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-surface border-gray-600 text-text-secondary'}`}>না</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 10 */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2"><FiPhone className="text-primary-light" /> যোগাযোগ</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className={labelClass}>মোবাইল নম্বর</label><input name="mobileNumber" value={formData.mobileNumber || ''} onChange={handleChange} type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>ইমেইল</label><input name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} type="email" className={inputClass} /></div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-gray-800 bg-surfaceHover/30 flex justify-between items-center">
          <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-600 text-text-primary hover:bg-gray-800 transition disabled:opacity-50">
            <FiChevronLeft /> পূর্ববর্তী
          </button>
          
          {currentStep < steps.length ? (
            <button onClick={nextStep} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition">
              পরবর্তী <FiChevronRight />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition flex items-center gap-2">
              {loading ? 'সাবমিট হচ্ছে...' : <><FiSave /> সাবমিট করুন</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
