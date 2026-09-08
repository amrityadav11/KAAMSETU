import{j as e,L as y,B as t,a as l,z as i}from"./index-CVVUlK3N.js";import{r}from"./vendor-CkzjRPv4.js";import{Q as c,q as f,O as j,R as w,V as N}from"./ui-BjGfNy8e.js";import"./http-BCn5QfZZ.js";function k(){const[s,n]=r.useState(null),[x,m]=r.useState(!0),[p,o]=r.useState(!1);r.useEffect(()=>{(async()=>{try{const b=await l.get("/businesses/my");n(b.data.data.business)}catch{}m(!1)})()},[]);const g=async()=>{o(!0);try{const a=await l.post(`/businesses/${s._id}/qr`);n({...s,qrCode:a.data.data.qrCode}),i.success("QR code regenerated")}catch{i.error("Failed to generate QR code")}finally{o(!1)}},h=()=>{if(!(s!=null&&s.qrCode))return;const a=document.createElement("a");a.href=s.qrCode,a.download=`${s.slug}-qr-code.png`,a.click(),i.success("QR code downloaded")},u=()=>{const a=window.open("","_blank");a.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Card — ${s.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', Arial, sans-serif; background: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          .card { width: 320px; padding: 32px 24px; border: 2px solid #16a34a; border-radius: 20px; text-align: center; }
          .brand { color: #16a34a; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
          .qr { width: 200px; height: 200px; margin: 0 auto 20px; border: 4px solid #16a34a; border-radius: 12px; padding: 8px; }
          .qr img { width: 100%; height: 100%; }
          .scan { font-size: 15px; color: #374151; font-weight: 600; margin-bottom: 8px; }
          .biz-name { font-size: 22px; font-weight: 900; color: #111827; margin-bottom: 4px; }
          .category { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
          .footer { font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">KaamSetu</div>
          <div class="qr"><img src="${s.qrCode}" alt="QR Code" /></div>
          <p class="scan">📱 Scan to view our business</p>
          <p class="biz-name">${s.name}</p>
          <p class="category">${s.category}</p>
          <div class="footer">Powered by KaamSetu · kaamsetu.in</div>
        </div>
      </body>
      </html>
    `),a.document.close(),a.print()};if(x)return e.jsx(y,{});if(!s)return e.jsx("div",{className:"p-6 text-center text-gray-500",children:"Please create your business first."});if(!s.isPublished)return e.jsx("div",{className:"p-6 md:p-8",children:e.jsxs("div",{className:"card text-center py-16 max-w-md mx-auto",children:[e.jsx(c,{size:40,className:"text-gray-300 mx-auto mb-4"}),e.jsx("h2",{className:"text-lg font-bold text-gray-900 mb-2",children:"Publish First"}),e.jsx("p",{className:"text-gray-500 text-sm mb-6",children:"Your QR code will be generated once you publish your business page."}),e.jsx("a",{href:"/dashboard/business",children:e.jsx(t,{children:"Go to My Business"})})]})});const d=`${window.location.origin}/business/${s.slug}`;return e.jsxs("div",{className:"p-6 md:p-8 max-w-2xl",children:[e.jsxs("div",{className:"mb-6",children:[e.jsx("h1",{className:"text-2xl font-black text-gray-900",children:"QR Code"}),e.jsx("p",{className:"text-gray-500 text-sm mt-1",children:"Share this QR code so customers can find your business instantly"})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"card text-center",children:[e.jsx("div",{className:"text-xs font-bold text-primary-600 uppercase tracking-widest mb-4",children:"KaamSetu"}),s.qrCode?e.jsx("div",{className:"inline-block border-4 border-primary-500 rounded-2xl p-3 mb-4 bg-white shadow-lg",children:e.jsx("img",{src:s.qrCode,alt:"QR Code",className:"w-44 h-44 rounded-xl"})}):e.jsx("div",{className:"w-52 h-52 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4",children:e.jsx(c,{size:48,className:"text-gray-300"})}),e.jsx("p",{className:"text-sm font-semibold text-gray-700 mb-1",children:"📱 Scan to view our business"}),e.jsx("p",{className:"text-lg font-black text-gray-900 mb-0.5",children:s.name}),e.jsx("p",{className:"text-sm text-gray-500 mb-4",children:s.category}),e.jsx("p",{className:"text-xs text-gray-400",children:"Powered by KaamSetu"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"card bg-gray-50",children:[e.jsx("p",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Business URL"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("p",{className:"text-sm text-primary-600 font-medium flex-1 break-all",children:d}),e.jsx("a",{href:d,target:"_blank",rel:"noreferrer",className:"p-1.5 text-gray-400 hover:text-primary-600",children:e.jsx(f,{size:15})})]})]}),e.jsx(t,{onClick:h,disabled:!s.qrCode,className:"w-full",icon:j,size:"lg",children:"Download QR Code"}),e.jsx(t,{onClick:u,disabled:!s.qrCode,variant:"secondary",className:"w-full",icon:w,size:"lg",children:"Print QR Card"}),e.jsx(t,{onClick:g,loading:p,variant:"outline",className:"w-full",icon:N,children:"Regenerate QR Code"}),e.jsxs("div",{className:"card bg-primary-50 border-primary-200",children:[e.jsx("p",{className:"text-sm font-semibold text-primary-800 mb-2",children:"💡 Tips for using your QR code"}),e.jsxs("ul",{className:"text-xs text-primary-700 space-y-1",children:[e.jsx("li",{children:"• Print and stick it at your shop entrance"}),e.jsx("li",{children:"• Add it to your visiting cards and pamphlets"}),e.jsx("li",{children:"• Share the image on WhatsApp groups"}),e.jsx("li",{children:"• Add it to your social media bio"})]})]})]})]})]})}export{k as default};
