import React from 'react'

const UploadExcel = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/85 backdrop-blur-md border border-[#00c9a7]/25 rounded-2xl p-10 text-center shadow-[0_8px_32px_rgba(15,31,61,0.12)]">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth={2} strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-[24px] font-bold text-[#1a2e4a] mb-2 font-[Syne,sans-serif]">
            Yet to be Implemented
          </h2>
          <p className="text-[14px] text-[#6b85a3] font-[DM_Sans,sans-serif]">
            This feature is coming soon.
          </p>
        </div>
      </div>
    </>
  )
}

export default UploadExcel