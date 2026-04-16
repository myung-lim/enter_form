import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, AlertCircle, Loader2, QrCode, 
  ClipboardList, Languages, ChevronDown 
} from "lucide-react";
import axios from "axios";

// --- 번역 데이터 데이터베이스 ---
const translations = {
  ko: {
    title: "군포네팔리 쉘터 입주 동의서",
    address: "주소 : 경기도 군포시 당산로7번길 27",
    qrOpen: "입주신청서 QR 코드 보기",
    qrClose: "QR 코드 닫기",
    qrDesc: "이 QR 코드를 스캔하면 입주 신청서 페이지로 바로 연결됩니다.",
    agreementTitle: "입주 동의 사항",
    agreementIntro: "군포 네팔리 쉘터에 입주하기 위해 본인은 다음과 같이 규칙을 확인하고 동의합니다.",
    rules: [
      {
        h: "1. 입주 기간 및 비용",
        l: [
          "입주기간은 최대 3개월이며 특별한 경우 협의 후 연장 가능하다.",
          "입주 비용은 입주 즉시 1회에 한해 5만원 입금(KB 529402-01-173299).",
          "특별한 사유로 계속 입주 시 매월 5만원을 1일에 입금한다."
        ]
      },
      {
        h: "2. 시설 관리 및 책임",
        l: [
          "시설 파손 시 비용 부담 및 손해 배상 책임이 있다.",
          "짐(캐리어)에는 반드시 이름/번호 태그를 부착해야 한다.",
          "퇴거 시 짐을 수거해야 하며, 3개월 방치 시 폐기 동의."
        ]
      },
      {
        h: "3. 준수 사항 및 강제 퇴거",
        l: [
          "공식 예배 필수 참석 (3회 불참 시 퇴거)",
          "쉘터 내 음주, 흡연 절대 금지",
          "경고 3회 누적 시 강제 퇴거",
          "폭행, 마약, 도박 등 범죄 행위 시 즉시 퇴거 및 신고"
        ]
      }
    ],
    formTitle: "입주 신청 정보 입력",
    labels: {
      name: "NAME (이름)",
      nickname: "NICKNAME (별명)",
      visa: "비자 종류",
      industry: "업종",
      phone: "전화번호",
      date: "입주일자",
      fb: "Facebook ID"
    },
    placeholders: {
      name: "이름을 입력하세요",
      nickname: "별명을 입력하세요",
      visa: "예: E-9, F-2 등",
      industry: "현재 종사 중인 업종",
      phone: "숫자만 입력 (01012345678)",
      fb: "Facebook ID를 입력하세요"
    },
    submit: "제출하기",
    submitting: "제출 중...",
    consentNotice: "※ '제출하기' 버튼을 클릭할 경우 위 사항을 모두 동의한 것으로 간주합니다.",
    success: "신청서가 성공적으로 제출되었습니다.",
    error: "제출 중 오류가 발생했습니다.",
    validation: {
      phone: "전화번호를 정확하게 입력하세요.",
      //fb: "Facebook ID를 다시 확인하세요."
    }
  },
  en: {
    title: "Gunpo Nepali Shelter Move-in Agreement",
    address: "Address: 27, Dangsan-ro 7-beon-gil, Gunpo-si, Gyeonggi-do",
    qrOpen: "Show QR Code",
    qrClose: "Close QR Code",
    qrDesc: "Scan this QR code to access the application page directly.",
    agreementTitle: "Agreement Terms",
    agreementIntro: "I confirm and agree to the following rules for moving into the Gunpo Nepali Shelter.",
    rules: [
      {
        h: "1. Period & Costs",
        l: [
          "Stay is up to 3 months, extendable upon consultation.",
          "One-time entry fee of 50,000 KRW (KB Bank 529402-01-173299).",
          "Monthly fee of 50,000 KRW for long-term stays (due on the 1st)."
        ]
      },
      {
        h: "2. Facilities & Liability",
        l: [
          "Responsibility for damages to facilities or property.",
          "Luggages must have tags (Name/Phone).",
          "Unclaimed items for 3 months after move-out will be discarded."
        ]
      },
      {
        h: "3. Compliance & Eviction",
        l: [
          "Mandatory attendance at official worship services.",
          "No drinking or smoking inside the shelter.",
          "Eviction after 3 warnings.",
          "Immediate eviction for violence, drugs, or gambling."
        ]
      }
    ],
    formTitle: "Application Information",
    labels: {
      name: "NAME",
      nickname: "NICKNAME",
      visa: "Visa Type",
      industry: "Industry",
      phone: "Phone Number",
      date: "Move-in Date",
      fb: "Facebook ID"
    },
    placeholders: {
      name: "Enter your name",
      nickname: "Enter your nickname",
      visa: "e.g., E-9, F-2",
      industry: "Current job category",
      phone: "Numbers only",
      fb: "Enter your Facebook ID"
    },
    submit: "Submit Application",
    submitting: "Submitting...",
    consentNotice: "※ Clicking 'Submit' constitutes agreement to all terms above.",
    success: "Application submitted successfully.",
    error: "An error occurred during submission.",
    validation: {
      phone: "Please enter a valid phone number.",
      fb: "Please check your Facebook ID."
    }
  },
  ne: {
    title: "गुन्पो नेपाली सेल्टर प्रवेश सम्झौता",
    address: "ठेगाना: २७, दान्सान-रो ७-बोन-गिल, गुन्पो-सी, ग्योन्गी-डो",
    qrOpen: "QR कोड हेर्नुहोस्",
    qrClose: "QR कोड बन्द गर्नुहोस्",
    qrDesc: "यो QR कोड स्क्यान गरेर सिधै आवेदन पृष्ठमा जानुहोस्।",
    agreementTitle: "सम्झौताका शर्तहरू",
    agreementIntro: "म गुन्पो नेपाली सेल्टरमा बस्नका लागि निम्न नियमहरू पालना गर्न सहमत छु।",
    rules: [
      {
        h: "१. अवधि र शुल्क",
        l: [
          "बसाई अवधि अधिकतम ३ महिना, विशेष अवस्थामा थप्न सकिनेछ।",
          "प्रवेश शुल्क एक पटकको ५०,००० वोन (KB बैंक ५२९४०२-०१-१७३२९९)।",
          "लामो समय बस्दा हरेक महिनाको १ तारिखमा ५०,००० वोन बुझाउनुपर्नेछ।"
        ]
      },
      {
        h: "२. सुविधाहरू र जिम्मेवारी",
        l: [
          "सेल्टरको क्षति भएमा मर्मत खर्च बेहोर्नुपर्नेछ।",
          "झोला (लगेज) मा नाम र फोन नम्बर सहितको ट्याग हुनुपर्छ।",
          "सेल्टर छोडेको ३ महिनासम्म सामान नलगेमा डिस्पोज गरिनेछ।"
        ]
      },
      {
        h: "३. पालना गर्नुपर्ने नियमहरू",
        l: [
          "आधिकारिक आराधना (Worship) मा अनिवार्य उपस्थिति।",
          "सेल्टर भित्र रक्सी र धुम्रपान पूर्ण निषेध।",
          "३ पटक चेतावनी पाएमा निष्कासन गरिनेछ।",
          "झगडा, लागूऔषध वा जुवा खेलेमा तुरुन्त निष्कासन गरिनेछ।"
        ]
      }
    ],
    formTitle: "आवेदन फारम",
    labels: {
      name: "नाम (NAME)",
      nickname: "उपनाम (NICKNAME)",
      visa: "भिसा प्रकार",
      industry: "कामको प्रकार",
      phone: "फोन नम्बर",
      date: "प्रवेश मिति",
      fb: "फेसबुक ID"
    },
    placeholders: {
      name: "आफ्नो नाम लेख्नुहोस्",
      nickname: "आफ्नो उपनाम लेख्नुहोस्",
      visa: "उदा: E-9, F-2",
      industry: "हाल गरिरहेको काम",
      phone: "नम्बर मात्र (उदा: 010...)",
      fb: "आफ्नो फेसबुक ID लेख्नुहोस्"
    },
    submit: "बुझाउनुहोस्",
    submitting: "बुझाउँदै...",
    consentNotice: "※ 'बुझाउनुहोस्' बटन थिच्नुको अर्थ माथिका सबै सर्तहरूमा सहमत हुनु हो।",
    success: "आवेदन सफलतापूर्वक बुझाइयो।",
    error: "बुझाउने क्रममा त्रुटि भयो।",
    validation: {
      phone: "कृपया सही फोन नम्बर राख्नुहोस्।",
      fb: "कृपया फेसबुक ID जाँच गर्नुहोस्।"
    }
  }
};

type LangType = "ko" | "en" | "ne";

export default function App() {
  const [lang, setLang] = useState<LangType>("ko");
  const t = translations[lang];

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    visaType: "",
    industry: "",
    phone: "",
    moveInDate: new Date().toISOString().split("T")[0],
    facebookId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showQR, setShowQR] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    if (formData.phone.length < 10) {
      setErrors({ phone: t.validation.phone });
      setIsSubmitting(false);
      return;
    }

    try {
      // Mock API call
      await axios.post("/api/send-email", {
        subject: `[네팔 쉘터 입주 동의] ${formData.name}`,
        content: JSON.stringify(formData, null, 2),
      });
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        
        {/* Language Switcher */}
        <div className="flex justify-end mb-6 gap-2">
          {(["ko", "en", "ne"] as LangType[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                lang === l 
                ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {l === "ko" ? "한국어" : l === "en" ? "English" : "नेपाली"}
            </button>
          ))}
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            {t.title}
          </h1>
          <p className="text-slate-500 text-sm">{t.address}</p>
          <button
            onClick={() => setShowQR(!showQR)}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:shadow-md transition-all"
          >
            <QrCode className="w-4 h-4" />
            {showQR ? t.qrClose : t.qrOpen}
          </button>
        </header>

        {/* QR Section */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 mb-8 flex flex-col items-center"
            >
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-inner mb-3">
                <QRCodeSVG value={window.location.href} size={160} />
              </div>
              <p className="text-xs text-slate-400 text-center">{t.qrDesc}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agreement */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
            {t.agreementTitle}
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            {t.agreementIntro}
          </p>
          <div className="space-y-6">
            {t.rules.map((rule, idx) => (
              <section key={idx}>
                <h3 className="font-bold text-slate-900 text-sm mb-2">{rule.h}</h3>
                <ul className="space-y-1.5">
                  {rule.l.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-8">
            <ClipboardList className="w-5 h-5 text-slate-900" />
            <h2 className="text-lg font-bold">{t.formTitle}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { id: "전체 성명(Full-name)", label: t.labels.name, ph: t.placeholders.name, type: "text" },
                { id: "성명(Nick-name)", label: t.labels.nickname, ph: t.placeholders.name, type: "text" },
                { id: "비자종류(visaType)", label: t.labels.visa, ph: t.placeholders.visa, type: "text" },
                { id: "업종(industry)", label: t.labels.industry, ph: t.placeholders.industry, type: "text" },
                { id: "전화번호(phone)", label: t.labels.phone, ph: t.placeholders.phone, type: "tel" },
                { id: "입주일(moveInDate)", label: t.labels.date, ph: "", type: "date" },
                { id: "facebook-Id", label: t.labels.fb, ph: t.placeholders.fb, type: "text" },
              ].map((field) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.id}
                    required
                    value={(formData as any)[field.id]}
                    onChange={handleChange}
                    placeholder={field.ph}
                    className={`px-4 py-3 bg-slate-50 border ${
                      errors[field.id] ? "border-red-500" : "border-slate-200"
                    } rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all text-sm`}
                  />
                  {errors[field.id] && (
                    <span className="text-[10px] text-red-500 font-medium ml-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors[field.id]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 mt-4">
              <p className="text-[11px] text-slate-400 text-center mb-4 leading-tight">
                {t.consentNotice}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t.submit
                )}
              </button>
            </div>
          </form>

          {/* Status Alert */}
          <AnimatePresence>
            {submitStatus !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 ${
                  submitStatus === "success" 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                  : "bg-rose-50 border-rose-100 text-rose-800"
                }`}
              >
                {submitStatus === "success" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                )}
                <p className="text-sm font-bold">
                  {submitStatus === "success" ? t.success : t.error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-12 text-center text-slate-400 text-[10px] pb-8 tracking-widest uppercase">
          &copy; 2025 Gunpo Nepali Shelter. Presence & Trust.
        </footer>
      </div>
    </div>
  );
}