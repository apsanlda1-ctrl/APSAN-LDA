/* APSAN public product catalogue and checkout */
import {initializeApp,getApps} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getDatabase,ref,onValue,push,set,update} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
const config={apiKey:"AIzaSyBe28uhKKzOycocioX0YyyUZ0jmODDAnCM",authDomain:"apsan-web-manegment.firebaseapp.com",databaseURL:"https://apsan-web-manegment-default-rtdb.firebaseio.com",projectId:"apsan-web-manegment",storageBucket:"apsan-web-manegment.firebasestorage.app",messagingSenderId:"1026894206568",appId:"1:1026894206568:web:a8896e7caf7f14d6118ddd"};
const app=getApps().length?getApps()[0]:initializeApp(config),db=getDatabase(app);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>new Intl.NumberFormat("pt-AO",{style:"currency",currency:"AOA",maximumFractionDigits:0}).format(Number(n)||0);
const fmtNAD=n=>"N$ "+Number(n).toLocaleString("en-NA",{minimumFractionDigits:2,maximumFractionDigits:2});
let products={};
function addStyles(){if(document.getElementById("apsanStoreCss"))return;const s=document.createElement("style");s.id="apsanStoreCss";s.textContent=`#apsan-products-public .aps-card-more{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:7px!important;padding:0 12px 12px!important}
#apsan-products-public .aps-share-icon{width:35px;height:35px;flex:0 0 35px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #d7e4f3;border-radius:10px;background:#eef5ff;color:#0757b8;font-size:15px;cursor:pointer;transition:background .18s,transform .18s}
#apsan-products-public .aps-share-icon:hover{background:#dcecff;transform:translateY(-1px)}
#apsan-products-public .aps-share-icon.copied{background:#e4f8e9;color:#168344;border-color:#b8e8ca}
#apsan-products-public .aps-detail-link{margin-left:auto;display:inline-flex;align-items:center;justify-content:flex-end;gap:5px;white-space:nowrap;font-size:13px!important}
@media(max-width:560px){#apsan-products-public .aps-card-more{gap:5px!important;padding:0 8px 10px!important}#apsan-products-public .aps-share-icon{width:30px;height:30px;flex-basis:30px;font-size:13px;border-radius:9px}#apsan-products-public .aps-detail-link{font-size:11px!important;gap:3px}}

#apsan-products-public{max-width:1200px;margin:0 auto;padding:22px 0 42px;border:0!important}
#apsan-products-public .aps-head{text-align:left;margin:0 auto 12px}
#apsan-products-public .aps-kicker{font-size:11px;letter-spacing:2px;font-weight:900;color:#bd941c}
#apsan-products-public .aps-head h2{font-size:clamp(25px,3vw,34px);margin:7px 0;color:#082d59}
#apsan-products-public .aps-head p{color:#64748b;margin:0}
#apsan-products-public .aps-toolbar{display:flex;flex-direction:column;align-items:stretch;gap:14px;margin:4px 0 24px}
#apsan-products-public .aps-filters{display:flex;gap:10px;flex-wrap:wrap}
#apsan-products-public .aps-filter{border:1px solid #d7e1ed;background:#fff;color:#092d60;padding:12px 19px;border-radius:30px;font:700 14px inherit;cursor:pointer;box-shadow:0 4px 12px #092b5010}
#apsan-products-public .aps-filter.active{background:#0757bd;color:#fff;border-color:#0757bd}
#apsan-products-public .aps-search{width:100%;max-width:none;padding:16px 18px 16px 48px;border:1px solid #d7e1ed;border-radius:15px;font:inherit;background:#fff url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23082d59%27 stroke-width=%272%27 stroke-linecap=%27round%27%3E%3Ccircle cx=%2711%27 cy=%2711%27 r=%277%27/%3E%3Cpath d=%27m20 20-4-4%27/%3E%3C/svg%3E") no-repeat 16px center;background-size:20px;box-shadow:0 5px 16px #092b500c}
#apsan-products-public .aps-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
#apsan-products-public .aps-card{border:1px solid #dce5ef;border-radius:17px;background:#fff;overflow:hidden;box-shadow:0 8px 24px #102b4d10;color:#172b43;display:flex;flex-direction:column;min-width:0}
#apsan-products-public .aps-photo{height:250px;background:linear-gradient(145deg,#edf4fb,#dceafa);overflow:hidden;position:relative;padding:10px}
#apsan-products-public .aps-photo img{width:100%;height:100%;object-fit:contain;display:block;border-radius:9px}
#apsan-products-public .aps-info{padding:17px 18px 10px;flex:1}
#apsan-products-public .aps-tag{display:inline-block;font-size:12px;font-weight:700;color:#0647a0;background:#e6efff;border-radius:20px;padding:5px 11px;text-transform:none}
#apsan-products-public .aps-info h3{font-size:19px;line-height:1.3;margin:11px 0;color:#092d60;text-transform:uppercase}
#apsan-products-public .aps-muted{font-size:13px;color:#68798d;line-height:1.5;margin:6px 0}
#apsan-products-public .aps-price{font-size:25px;font-weight:900;color:#a51f2b;margin:13px 0 4px;display:flex;align-items:center;gap:9px;flex-wrap:wrap}
#apsan-products-public .aps-old{font-size:15px;color:#8995a5;text-decoration:line-through;margin-left:2px;font-weight:650}
#apsan-products-public .aps-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px 16px 17px}
#apsan-products-public .aps-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border:0;border-radius:12px;padding:14px 9px;font-weight:800;font-size:14px;cursor:pointer;background:#e8f0ff;color:#0647a0;min-height:50px;transition:transform .18s,filter .18s}#apsan-products-public .aps-btn:active{transform:scale(.98)}
#apsan-products-public .aps-btn.primary{background:#0757b8;color:white}
#apsan-products-public .aps-btn.wa{background:#079b43;color:white}
#apsan-products-public .aps-sale-ribbon{position:absolute;top:16px;right:-35px;z-index:2;background:#e21d2d;color:#fff;padding:8px 42px;font-size:12px;font-weight:900;letter-spacing:.7px;transform:rotate(35deg);box-shadow:0 3px 9px #0002}#apsan-products-public .aps-discount{display:inline-flex;align-items:center;justify-content:center;background:#e8173c;color:#fff;border-radius:22px;padding:6px 11px;font-size:13px;font-weight:900}#apsan-products-public .aps-location{font-size:14px}#apsan-products-public .aps-location i{color:#0757b8;margin-right:4px}#apsan-products-public .aps-empty{grid-column:1/-1;text-align:center;padding:35px 20px;background:#fff;border:1px dashed #cbd8e7;border-radius:16px;color:#64748b;line-height:1.6}
#apsan-products-public .aps-pagination{display:flex;justify-content:center;align-items:center;gap:9px;margin:28px 0 8px;flex-wrap:wrap}
#apsan-products-public .aps-page{border:1px solid #d7e1ed;background:#fff;color:#173b68;border-radius:14px;padding:12px 18px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px #092b5010}
#apsan-products-public .aps-page.active{background:#082d59;color:#fff;border-color:#082d59}
#apsan-products-public .aps-page:disabled{opacity:.45;cursor:not-allowed}
#apsan-products-public .aps-modal{position:fixed;inset:0;z-index:99999;background:#07182bcc;display:grid;place-items:center;padding:14px;overflow:auto}
#apsan-products-public .aps-dialog{width:min(720px,100%);max-height:94vh;overflow:auto;background:white;border-radius:18px;padding:20px;color:#172b43}
#apsan-products-public .aps-dialog h2{margin:0 0 12px;color:#092f73}
#apsan-products-public .aps-close{float:right;border:0;background:#edf2f7;border-radius:50%;width:36px;height:36px;font-size:20px;cursor:pointer}
#apsan-products-public .aps-detail-img{width:100%;max-height:320px;object-fit:contain;background:#f1f5f9;border-radius:12px}
#apsan-products-public .aps-formgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#apsan-products-public .aps-field{display:grid;gap:5px;margin:10px 0}
#apsan-products-public .aps-field.wide{grid-column:1/-1}
#apsan-products-public .aps-field label{font-size:13px;font-weight:750}
#apsan-products-public .aps-field input,#apsan-products-public .aps-field textarea,#apsan-products-public .aps-field select{width:100%;padding:11px;border:1px solid #d7e0eb;border-radius:9px;font:inherit}
#apsan-products-public .aps-paybox{background:#edf4ff;border-radius:11px;padding:13px;margin:10px 0;color:#123c70}
#apsan-products-public .aps-paybox p{margin:6px 0;overflow-wrap:anywhere}
#apsan-products-public .aps-message{padding:11px;background:#eaf8ef;color:#126b3c;border-radius:9px;margin:10px 0}
/* APSAN premium product detail modal */
#apsan-products-public .aps-dialog{width:min(1080px,100%);max-height:95vh;padding:28px;border-radius:24px;box-shadow:0 24px 80px #061b3540}
#apsan-products-public .aps-dialog .aps-detail-top{display:flex;align-items:flex-start;justify-content:space-between;margin:0 0 20px;padding-right:42px}
#apsan-products-public .aps-dialog .aps-detail-heading{display:flex;gap:14px;align-items:stretch}
#apsan-products-public .aps-dialog .aps-detail-accent{width:7px;min-height:54px;border-radius:8px;background:#f4c328}
#apsan-products-public .aps-dialog .aps-detail-heading h2{font-size:clamp(23px,3vw,34px);line-height:1.16;margin:0;color:#092f73;text-transform:uppercase}
#apsan-products-public .aps-dialog .aps-close{position:absolute;right:calc((100% - min(1080px,100%))/2 + 16px);top:calc((100% - min(95vh,900px))/2 + 16px);z-index:3;width:42px;height:42px;background:#edf2f7;color:#10243e}
#apsan-products-public .aps-detail-layout{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);gap:26px;align-items:start}
#apsan-products-public .aps-detail-mainimage{height:410px;background:#f1f5fa;border-radius:18px;display:grid;place-items:center;overflow:hidden;padding:14px}
/* Correct responsive product gallery: no clipped YouTube controls or images */
#apsan-products-public .aps-detail-mainimage{width:100%;height:auto!important;min-height:0!important;aspect-ratio:16/9;box-sizing:border-box}
#apsan-products-public .aps-detail-mainimage img{display:block;width:100%;height:100%;max-width:100%;object-fit:contain;object-position:center;image-rendering:auto}
#apsan-products-public .aps-detail-mainimage iframe{display:block;width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;aspect-ratio:16/9;border:0}
#apsan-products-public .aps-detail-mainimage.aps-media-playing{padding:0!important;background:#071b31}
#apsan-products-public .aps-detail-thumbs{max-width:100%;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;overscroll-behavior-x:contain}
#apsan-products-public .aps-detail-thumb{overflow:hidden}
#apsan-products-public .aps-detail-thumb img{display:block;width:100%;height:100%;object-fit:contain;image-rendering:auto}
#apsan-products-public .aps-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px;box-sizing:border-box}
#apsan-products-public .aps-dialog{width:min(1080px,100%);max-width:100%;max-height:calc(100dvh - 20px);overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;box-sizing:border-box}
#apsan-products-public .aps-dialog *{box-sizing:border-box}
#apsan-products-public .aps-detail-layout,#apsan-products-public .aps-detail-summary{min-width:0;max-width:100%}
#apsan-products-public .aps-modal{position:fixed!important;inset:0!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;overflow:hidden!important;padding:12px!important;box-sizing:border-box!important}
#apsan-products-public .aps-dialog{width:min(1080px,calc(100vw - 24px))!important;max-width:100%!important;max-height:calc(100dvh - 24px)!important;height:auto!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior-y:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;margin:0 auto!important;box-sizing:border-box!important}
#apsan-products-public .aps-dialog:has(.aps-detail-layout){max-height:calc(100dvh - 24px)!important;overflow-y:auto!important}
#apsan-products-public .aps-detail-layout{min-height:0!important}
#apsan-products-public .aps-detail-gallery,#apsan-products-public .aps-detail-summary{min-width:0!important}
#apsan-products-public .aps-detail-thumbs{overflow-x:auto!important;overflow-y:hidden!important;touch-action:pan-x!important}
#apsan-products-public .aps-detail-layout{align-items:start!important}
#apsan-products-public .aps-detail-gallery{min-width:0!important}
#apsan-products-public .aps-detail-mainimage{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:16/9!important;overflow:hidden!important}
#apsan-products-public .aps-detail-mainimage iframe{width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;aspect-ratio:16/9!important}
#apsan-products-public .aps-detail-mainimage img{object-fit:contain!important}
#apsan-products-public .aps-product-demo-frame{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:12px}
#apsan-products-public .aps-product-demo-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
#apsan-products-public .aps-detail-video-section{margin:18px 0}
#apsan-products-public .aps-detail-description,#apsan-products-public .aps-detail-location{overflow-wrap:anywhere}

#apsan-products-public .aps-detail-mainimage img{width:100%;height:100%;object-fit:contain}
#apsan-products-public .aps-detail-mainimage iframe{display:block;width:100%;height:100%;min-height:260px;border:0}
#apsan-products-public .aps-detail-mainimage.aps-media-playing{padding:0;background:#071b31}
#apsan-products-public .aps-detail-thumb .aps-video-thumb{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:#172b43;color:#fff;border-radius:7px}
#apsan-products-public .aps-detail-thumb .aps-video-thumb>i{font-size:23px;color:#ff2424}
#apsan-products-public .aps-detail-thumb .aps-video-thumb b{font-size:11px}
#apsan-products-public .aps-detail-thumb .aps-video-play{font-size:13px;color:#fff}
#apsan-products-public .aps-detail-noimage{height:260px;border-radius:18px;background:#f1f5fa;display:grid;place-items:center;color:#718096}
#apsan-products-public .aps-detail-thumbs{display:flex;gap:9px;margin-top:12px;overflow:auto;padding:2px}
#apsan-products-public .aps-detail-thumb{width:82px;height:76px;flex:0 0 82px;padding:4px;border:2px solid #dce5ef;border-radius:11px;background:#f1f5fa;cursor:pointer}
#apsan-products-public .aps-detail-thumb.active{border-color:#0757bd}
#apsan-products-public .aps-detail-thumb img{width:100%;height:100%;object-fit:contain}
#apsan-products-public .aps-product-demo{margin-top:18px;padding:15px;background:#f5f8fc;border:1px solid #dce5ef;border-radius:16px}
#apsan-products-public .aps-product-demo h3{display:flex;align-items:center;gap:9px;margin:0 0 12px;color:#092d60;font-size:17px}
#apsan-products-public .aps-product-demo h3 i{color:#e62117;font-size:21px}
#apsan-products-public .aps-product-demo-frame{width:100%;aspect-ratio:16/9;background:#071b31;border-radius:11px;overflow:hidden}
#apsan-products-public .aps-product-demo-frame iframe{display:block;width:100%;height:100%;border:0}
#apsan-products-public .aps-detail-summary{padding:8px 0}
#apsan-products-public .aps-detail-category{display:inline-flex;align-items:center;gap:8px;padding:9px 15px;border-radius:25px;background:#e8f1ff;color:#0757bd;font-weight:800}
#apsan-products-public .aps-detail-description{font-size:18px;line-height:1.55;color:#24364d;margin:22px 0}
#apsan-products-public .aps-expandable-text{line-height:1.55;overflow-wrap:anywhere}
#apsan-products-public .aps-expand-toggle{display:inline-flex;align-items:center;gap:5px;margin:7px 0 0;padding:0;border:0;background:transparent;color:#0757bd;font:800 13px inherit;cursor:pointer}
#apsan-products-public .aps-expand-toggle:hover{text-decoration:underline}
#apsan-products-public .aps-card-description{font-size:13px;color:#68798d;line-height:1.5;margin:6px 0}
#apsan-products-public .aps-card-description .aps-expand-toggle{font-size:12px}
#apsan-products-public .aps-detail-description .aps-expand-toggle{font-size:14px}
#apsan-products-public .aps-detail-tabpanel .aps-expand-toggle{font-size:14px}
#apsan-products-public .aps-detail-location{font-size:16px;color:#173b68;padding-bottom:18px;border-bottom:1px solid #dce5ef}
#apsan-products-public .aps-detail-location i{margin-right:7px}
#apsan-products-public .aps-detail-pricebox{padding:18px 0;border-bottom:1px solid #dce5ef}
#apsan-products-public .aps-detail-promo{display:inline-block;background:#e51d2a;color:white;padding:7px 13px;border-radius:9px;font-size:13px;font-weight:900;margin-bottom:10px}
#apsan-products-public .aps-detail-price-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
#apsan-products-public .aps-detail-price-row strong{font-size:clamp(26px,3vw,36px);color:#b51e2c}
#apsan-products-public .aps-detail-discount{padding:8px 12px;background:#ffe1e4;color:#b51e2c;border-radius:12px;font-size:19px;font-weight:900}
#apsan-products-public .aps-detail-pricebox del{display:block;color:#7b899a;font-size:18px;font-weight:700;margin-top:4px}
#apsan-products-public .aps-detail-stock{display:flex;align-items:center;gap:13px;padding:18px 2px;color:#172b43;line-height:1.5}
#apsan-products-public .aps-detail-stock i{font-size:27px;color:#079b43}
#apsan-products-public .aps-detail-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:24px 0 12px}
#apsan-products-public .aps-detail-tabs button{padding:14px 10px;border:1px solid #d7e1ed;border-radius:13px;background:white;color:#102b53;font:700 15px inherit;cursor:pointer}
#apsan-products-public .aps-detail-tabs button.active{background:#0757bd;color:white;border-color:#0757bd}
#apsan-products-public .aps-detail-tabpanel{min-height:100px;padding:20px 22px;border-radius:16px;background:#f7faff;color:#24364d;font-size:16px;line-height:1.65;white-space:pre-line}
#apsan-products-public .aps-detail-cta{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px}
#apsan-products-public .aps-detail-cta .aps-btn{min-height:62px;font-size:16px;border-radius:14px;gap:9px}
@media(max-width:700px){#apsan-products-public .aps-modal{display:flex!important;align-items:flex-start!important;overflow:hidden!important;padding:8px!important}#apsan-products-public .aps-dialog{width:100%!important;max-width:100%!important;max-height:calc(100dvh - 16px)!important;height:auto!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;margin:0 auto!important}#apsan-products-public .aps-dialog{width:100%;max-height:calc(100dvh - 20px);padding:20px 16px 18px;border-radius:22px}#apsan-products-public .aps-dialog .aps-close{position:sticky;float:right;top:0;margin:0 0 -44px 0;right:auto}#apsan-products-public .aps-dialog .aps-detail-top{padding-right:42px;margin-bottom:16px}#apsan-products-public .aps-dialog .aps-detail-heading h2{font-size:23px}#apsan-products-public .aps-detail-layout{grid-template-columns:1fr;gap:12px}#apsan-products-public .aps-detail-mainimage{height:auto!important;min-height:0!important;aspect-ratio:16/9;padding:8px}#apsan-products-public .aps-detail-mainimage iframe{height:100%!important;min-height:0!important;aspect-ratio:16/9}#apsan-products-public .aps-detail-summary{padding:2px 2px 0}#apsan-products-public .aps-detail-description{font-size:16px;margin:14px 0}#apsan-products-public .aps-detail-location{padding-bottom:13px;margin:0}#apsan-products-public .aps-detail-pricebox{padding:14px 0}#apsan-products-public .aps-detail-stock{padding:13px 2px}#apsan-products-public .aps-detail-tabs{gap:6px;margin:16px 0 10px}#apsan-products-public .aps-detail-tabs button{font-size:12px;padding:12px 5px}#apsan-products-public .aps-detail-tabpanel{padding:15px;font-size:14px;min-height:80px}#apsan-products-public .aps-detail-cta{gap:9px;margin-top:16px}#apsan-products-public .aps-detail-cta .aps-btn{font-size:13px;min-height:54px;padding:10px 6px}}

/* APSAN checkout refreshed */
#apsan-products-public .aps-dialog:has(.aps-checkout){width:min(1120px,100%);padding:0;max-height:96vh;overflow:auto;border-radius:24px;background:#f4f8fd}
#apsan-products-public .aps-dialog:has(.aps-checkout)>.aps-close{position:sticky;float:right;top:12px;margin:12px 12px -52px 0;z-index:5;background:#eaf1f9;color:#0a2f5d;width:40px;height:40px}
#apsan-products-public .aps-checkout{color:#102b50}
#apsan-products-public .aps-checkout-brand{display:flex;align-items:center;gap:12px;padding:17px 24px;background:#062b59;color:white}
#apsan-products-public .aps-checkout-brand img{width:54px;height:54px;object-fit:contain;background:#fff;border-radius:10px}
#apsan-products-public .aps-checkout-brand>div{display:grid;gap:3px}
#apsan-products-public .aps-checkout-brand>div b{font-size:19px}
#apsan-products-public .aps-checkout-brand small{font-size:10px;letter-spacing:.8px;color:#d6e5f8}
#apsan-products-public .aps-secure{margin-left:auto;border:1px solid #75b8ff;border-radius:30px;padding:9px 12px;font-size:12px;font-weight:800}
#apsan-products-public .aps-checkout-hero{display:flex;align-items:center;gap:16px;padding:22px 25px;background:linear-gradient(120deg,#082d59,#0872c5);color:#fff}
#apsan-products-public .aps-checkout-hero>span{width:52px;height:52px;display:grid;place-items:center;border-radius:15px;background:#ffffff20;font-size:25px}
#apsan-products-public .aps-checkout-hero h2{color:#fff!important;font-size:27px;margin:0 0 5px!important}
#apsan-products-public .aps-checkout-hero p{margin:0;color:#e0efff;font-size:14px;line-height:1.5}
#apsan-products-public .aps-checkout-product{display:grid;grid-template-columns:86px 1fr auto;gap:14px;align-items:center;margin:18px 20px;padding:13px;background:#fff;border:1px solid #dce6f1;border-radius:16px;box-shadow:0 6px 18px #092b500c}
#apsan-products-public .aps-checkout-product-image{height:84px;border-radius:10px;background:#edf4fb;display:grid;place-items:center;overflow:hidden;color:#0b5eb0;font-size:26px}
#apsan-products-public .aps-checkout-product-image img{width:100%;height:100%;object-fit:contain}
#apsan-products-public .aps-checkout-product-info{display:grid;gap:4px;min-width:0}
#apsan-products-public .aps-checkout-product-info small{font-size:10px;letter-spacing:1px;color:#718096;font-weight:900}
#apsan-products-public .aps-checkout-product-info b{font-size:15px;color:#092d60}
#apsan-products-public .aps-checkout-product-info span{font-size:12px;color:#718096}
#apsan-products-public .aps-checkout-product-price{display:grid;gap:4px;text-align:right}
#apsan-products-public .aps-checkout-product-price small{font-size:11px;color:#718096}
#apsan-products-public .aps-checkout-product-price b{font-size:19px;color:#b51e2c}
#apsan-products-public .aps-checkout-product-price del{font-size:12px;color:#8491a1}
#apsan-products-public .aps-checkout-form{padding:0 20px 20px}
#apsan-products-public .aps-checkout-columns{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
#apsan-products-public .aps-checkout-section{padding:18px;background:#fff;border:1px solid #dce6f1;border-radius:17px;margin-bottom:14px;box-shadow:0 5px 16px #092b5008}
#apsan-products-public .aps-checkout-section h3{display:flex;align-items:center;gap:10px;margin:0 0 15px;color:#082d59;font-size:17px}
#apsan-products-public .aps-checkout-section h3 i{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:#e8f1ff;color:#0757bd}
#apsan-products-public .aps-checkout .aps-field{gap:6px;margin:11px 0}
#apsan-products-public .aps-checkout .aps-field label{font-size:13px;color:#203b5d}
#apsan-products-public .aps-checkout .aps-field input,#apsan-products-public .aps-checkout .aps-field textarea,#apsan-products-public .aps-checkout .aps-field select{padding:12px 13px;border:1px solid #ccd9e8;border-radius:11px;background:#fbfdff;font-size:14px;min-height:46px}
#apsan-products-public .aps-checkout .aps-field input:focus,#apsan-products-public .aps-checkout .aps-field textarea:focus,#apsan-products-public .aps-checkout .aps-field select:focus{outline:2px solid #9dc7ff;border-color:#2876d2}
#apsan-products-public .aps-checkout .aps-field small{font-size:11px;color:#64748b;line-height:1.5}
#apsan-products-public .aps-checkout-summary>div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #e5edf5;font-size:14px}
#apsan-products-public .aps-checkout-summary>div b{color:#173b68;text-align:right}
#apsan-products-public .aps-checkout-summary .aps-checkout-total{margin-top:8px;padding:13px 14px;border:0;border-radius:12px;background:#e8f1ff;font-size:16px;font-weight:900;color:#092d60}
#apsan-products-public .aps-checkout-summary .aps-checkout-total b{font-size:20px;color:#092d73}
#apsan-products-public .aps-checkout .aps-paybox{padding:0;background:transparent;margin:0;color:#173b68}
#apsan-products-public .aps-pay-method-title{display:flex;align-items:center;gap:9px;margin-bottom:12px;font-weight:900;color:#092d60}
#apsan-products-public .aps-pay-method-title i{color:#0757bd}
#apsan-products-public .aps-pay-option{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #d5e1ef;border-radius:12px;margin:8px 0;cursor:pointer}
#apsan-products-public .aps-pay-option:has(input:checked){border-color:#0757bd;background:#edf5ff}
#apsan-products-public .aps-pay-option input{width:18px;height:18px;accent-color:#0757bd}
#apsan-products-public .aps-pay-option span{display:grid;gap:3px}
#apsan-products-public .aps-pay-option b{font-size:13px}
#apsan-products-public .aps-pay-option small{font-size:11px;color:#718096}
#apsan-products-public .aps-bank-details{display:grid;gap:5px;margin-top:12px;padding:13px;border-radius:12px;background:#eaf2ff;overflow-wrap:anywhere}
#apsan-products-public .aps-bank-details small{font-size:11px;color:#62758d}
#apsan-products-public .aps-bank-details b{font-size:14px;color:#092d60}
#apsan-products-public .aps-upload{display:grid;place-items:center;gap:7px;min-height:130px;padding:18px;border:1.5px dashed #78a9e4;border-radius:14px;background:#f4f8ff;color:#0757bd;cursor:pointer;text-align:center}
#apsan-products-public .aps-upload>i{font-size:27px}
#apsan-products-public .aps-upload b{font-size:14px}
#apsan-products-public .aps-upload span{font-size:11px;color:#64748b}
#apsan-products-public .aps-upload input{max-width:100%;font-size:11px}
#apsan-products-public .aps-file-name{display:block;margin-top:8px;color:#64748b;font-size:11px;overflow-wrap:anywhere}
#apsan-products-public .aps-checkout-whatsapp{display:flex;gap:12px;padding:14px;margin:0 0 14px;border-radius:14px;background:#eaf8ef;color:#145c38}
#apsan-products-public .aps-checkout-whatsapp>i{font-size:27px;color:#079b43}
#apsan-products-public .aps-checkout-whatsapp b{font-size:13px}
#apsan-products-public .aps-checkout-whatsapp p{font-size:12px;line-height:1.5;margin:4px 0 0}
#apsan-products-public .aps-checkout-submit{width:100%;min-height:58px;border-radius:13px;font-size:16px;gap:9px;box-shadow:0 8px 18px #0757bd30}
#apsan-products-public .aps-checkout-submit:disabled{opacity:.65;cursor:wait}
#apsan-products-public .aps-checkout-trust{display:flex;justify-content:space-around;gap:10px;flex-wrap:wrap;padding:15px 20px;background:#fff;border-top:1px solid #dce6f1;color:#29496d;font-size:12px;font-weight:800}
#apsan-products-public .aps-checkout-trust span{display:flex;align-items:center;gap:7px}
#apsan-products-public .aps-checkout-trust i{color:#0757bd;font-size:17px}
#apsan-products-public .aps-success{text-align:center;padding:20px 8px}
#apsan-products-public .aps-success-icon{width:62px;height:62px;margin:0 auto 12px;border-radius:50%;display:grid;place-items:center;background:#e5f8ec;color:#079b43;font-size:28px}
#apsan-products-public .aps-success h3{font-size:23px;color:#0b6b3d;margin:8px 0}
#apsan-products-public .aps-success p{font-size:14px;line-height:1.6;color:#50647b}
#apsan-products-public .aps-reference{display:grid;gap:5px;margin:15px auto;padding:13px;border-radius:12px;background:#edf4ff;color:#64748b;font-size:12px;max-width:420px}
#apsan-products-public .aps-reference b{font-size:16px;color:#092d60;overflow-wrap:anywhere}
#apsan-products-public .aps-wa-confirm{width:100%;min-height:55px;margin-top:8px;gap:8px}
#apsan-products-public .aps-message-error{background:#fff0f0;color:#a51f2b}
@media(max-width:700px){#apsan-products-public .aps-dialog:has(.aps-checkout){width:100%;max-height:calc(100dvh - 12px);border-radius:18px}#apsan-products-public .aps-checkout-brand{padding:13px 15px}#apsan-products-public .aps-checkout-brand img{width:43px;height:43px}#apsan-products-public .aps-checkout-brand>div b{font-size:15px}#apsan-products-public .aps-secure{font-size:10px;padding:7px 8px}#apsan-products-public .aps-checkout-hero{padding:17px 15px;gap:11px}#apsan-products-public .aps-checkout-hero>span{width:42px;height:42px;font-size:20px}#apsan-products-public .aps-checkout-hero h2{font-size:22px}#apsan-products-public .aps-checkout-hero p{font-size:12px}#apsan-products-public .aps-checkout-product{grid-template-columns:65px 1fr auto;margin:12px;padding:10px;gap:9px}#apsan-products-public .aps-checkout-product-image{height:65px}#apsan-products-public .aps-checkout-product-info b{font-size:12px}#apsan-products-public .aps-checkout-product-price b{font-size:15px}#apsan-products-public .aps-checkout-form{padding:0 12px 14px}#apsan-products-public .aps-checkout-columns{grid-template-columns:1fr;gap:0}#apsan-products-public .aps-checkout-section{padding:14px;margin-bottom:11px}#apsan-products-public .aps-checkout-section h3{font-size:15px;margin-bottom:10px}#apsan-products-public .aps-checkout .aps-formgrid{grid-template-columns:1fr 1fr;gap:8px}#apsan-products-public .aps-checkout .aps-field input,#apsan-products-public .aps-checkout .aps-field textarea,#apsan-products-public .aps-checkout .aps-field select{font-size:14px;padding:11px}#apsan-products-public .aps-checkout-trust{padding:12px 8px;font-size:10px;gap:8px}#apsan-products-public .aps-checkout-trust span{gap:4px}#apsan-products-public .aps-checkout-summary .aps-checkout-total b{font-size:18px}}
@media(max-width:390px){#apsan-products-public .aps-checkout-brand small{font-size:8px}#apsan-products-public .aps-secure{font-size:9px}#apsan-products-public .aps-checkout .aps-formgrid{grid-template-columns:1fr}#apsan-products-public .aps-checkout-product{grid-template-columns:56px 1fr}#apsan-products-public .aps-checkout-product-price{grid-column:2;text-align:left;display:flex;align-items:center;gap:8px}}

@media(max-width:850px){#apsan-products-public .aps-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){#apsan-products-public{padding:8px 0 30px}#apsan-products-public .aps-toolbar{align-items:stretch;gap:14px}#apsan-products-public .aps-filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}#apsan-products-public .aps-filter{padding:11px 4px;font-size:12px}#apsan-products-public .aps-search{width:100%;max-width:none;padding:15px 12px 15px 43px}#apsan-products-public .aps-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#apsan-products-public .aps-photo{height:clamp(125px,38vw,210px);padding:7px}#apsan-products-public .aps-info{padding:11px 10px 7px}#apsan-products-public .aps-info h3{font-size:14px;line-height:1.3}#apsan-products-public .aps-price{font-size:18px}#apsan-products-public .aps-actions{grid-template-columns:1fr;gap:7px;padding:8px 9px 11px}#apsan-products-public .aps-btn{font-size:12px;min-height:42px;padding:10px 6px}#apsan-products-public .aps-card-description{font-size:11px}#apsan-products-public .aps-actions{padding:9px 14px 15px;gap:9px}#apsan-products-public .aps-btn{font-size:12px;padding:12px 6px;min-height:49px}#apsan-products-public .aps-formgrid{grid-template-columns:1fr}}
/* Homepage catalogue layout: two balanced columns on phones and desktops */
#apsan-products-public .aps-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:20px!important}
#apsan-products-public .aps-card{min-width:0;border-radius:18px}
#apsan-products-public .aps-photo{height:250px}
#apsan-products-public .aps-info h3{font-size:clamp(14px,1.5vw,19px);line-height:1.3}
@media(max-width:560px){
 #apsan-products-public{padding:18px 0 30px!important}
 #apsan-products-public .aps-head{padding:0 2px 8px}
 #apsan-products-public .aps-head h2{font-size:23px!important;margin:6px 0}
 #apsan-products-public .aps-head p{font-size:13px}
 #apsan-products-public .aps-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
 #apsan-products-public .aps-photo{height:clamp(135px,40vw,205px);padding:7px}
 #apsan-products-public .aps-info{padding:11px 10px 7px}
 #apsan-products-public .aps-info h3{font-size:13px;line-height:1.3;margin:8px 0}
 #apsan-products-public .aps-muted{font-size:11px;line-height:1.4}
 #apsan-products-public .aps-price{font-size:17px;margin:9px 0 3px;gap:5px}
 #apsan-products-public .aps-old{font-size:11px}
 #apsan-products-public .aps-tag{font-size:10px;padding:4px 7px}
 #apsan-products-public .aps-actions{grid-template-columns:1fr!important;gap:7px;padding:8px 9px 10px!important}
 #apsan-products-public .aps-btn{font-size:11px;min-height:42px;padding:9px 5px}
 #apsan-products-public .aps-card-description{font-size:11px}
}

/* Storefront-style two-column featured products */
#apsan-products-public{max-width:1200px!important;padding:26px 14px 42px!important}
#apsan-products-public .aps-feature-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 18px}
#apsan-products-public .aps-feature-head h2{font-size:clamp(22px,3vw,34px);margin:0;color:#101f55;display:flex;align-items:center;gap:10px}
#apsan-products-public .aps-see-all{display:inline-flex;align-items:center;gap:8px;color:#092d60;text-decoration:none;font-weight:850;white-space:nowrap}
#apsan-products-public .aps-toolbar{margin:0 0 18px}
#apsan-products-public .aps-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px!important}
#apsan-products-public .aps-card{border:1px solid #dce3ed;border-radius:18px;background:#fff;box-shadow:0 3px 9px #14294d12;overflow:hidden;min-width:0}
#apsan-products-public .aps-photo{height:clamp(155px,28vw,285px);padding:10px;background:#fff;display:grid;place-items:center}
#apsan-products-public .aps-photo img{width:100%;height:100%;object-fit:contain}
#apsan-products-public .aps-info{padding:0 13px 8px}
#apsan-products-public .aps-info h3{font-size:clamp(14px,1.7vw,21px);line-height:1.25;color:#101b4c;text-transform:none;margin:8px 0 5px}
#apsan-products-public .aps-tag{display:none}
#apsan-products-public .aps-card-description{font-size:13px;color:#27344a;line-height:1.4;margin:0 0 6px}
#apsan-products-public .aps-price{font-size:clamp(17px,2vw,25px);color:#092d73;margin:7px 0 0}
#apsan-products-public .aps-card-buy{display:grid;grid-template-columns:46px minmax(0,1fr);gap:9px;align-items:center;padding:5px 12px 10px}
#apsan-products-public .aps-card-whatsapp{width:43px;height:43px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #b8e8ca;border-radius:11px;background:#eaf8ef;color:#168a48;text-decoration:none;font-size:25px;transition:.2s}
#apsan-products-public .aps-card-whatsapp:hover{background:#20bd5a;color:#fff;border-color:#20bd5a;transform:translateY(-1px)}
#apsan-products-public .aps-card-whatsapp[aria-disabled="true"]{opacity:.45;pointer-events:none}
#apsan-products-public .aps-qty-stepper{height:43px;display:grid;grid-template-columns:30px minmax(20px,1fr) 30px;align-items:center;border:1px solid #d4dce8;border-radius:10px;overflow:hidden;background:#f8fafc}
#apsan-products-public .aps-qty-stepper button{height:100%;border:0;background:#f1f4f8;color:#12234c;font-size:21px;font-weight:700;cursor:pointer}
#apsan-products-public .aps-qty-stepper input{width:100%;min-width:0;border:0;background:transparent;text-align:center;font-weight:850;color:#172554;font-size:15px;appearance:textfield}
#apsan-products-public .aps-qty-stepper input::-webkit-inner-spin-button{-webkit-appearance:none}
#apsan-products-public .aps-add-button{width:100%;min-height:43px;padding:9px 8px;border-radius:11px;font-size:13px;gap:6px;white-space:nowrap}
#apsan-products-public .aps-card-more{display:flex;justify-content:flex-end;padding:0 13px 12px;font-size:12px}
#apsan-products-public .aps-detail-link{border:0;background:none;color:#0757bd;font:700 12px inherit;padding:0;cursor:pointer}
#apsan-products-public .aps-no-photo{font-size:42px;color:#a8b5c6}
@media(max-width:560px){
 #apsan-products-public{padding:22px 10px 32px!important}
 #apsan-products-public .aps-feature-head{margin-bottom:14px}
 #apsan-products-public .aps-feature-head h2{font-size:21px}
 #apsan-products-public .aps-see-all{font-size:12px;gap:5px}
 #apsan-products-public .aps-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
 #apsan-products-public .aps-photo{height:clamp(125px,39vw,190px);padding:6px}
 #apsan-products-public .aps-info{padding:0 9px 7px}
 #apsan-products-public .aps-info h3{font-size:13px;line-height:1.25;margin:6px 0 4px}
 #apsan-products-public .aps-card-description{font-size:11px;line-height:1.35}
 #apsan-products-public .aps-card-description .aps-expand-toggle{font-size:11px;margin-top:3px}
 #apsan-products-public .aps-price{font-size:16px;margin:6px 0 0;gap:4px}
 #apsan-products-public .aps-old{font-size:10px}
 #apsan-products-public .aps-discount{font-size:10px;padding:4px 7px}
 #apsan-products-public .aps-card-buy{grid-template-columns:minmax(66px,.8fr) minmax(0,1.2fr);gap:6px;padding:4px 8px 8px}
 #apsan-products-public .aps-qty-stepper{height:38px;grid-template-columns:24px minmax(18px,1fr) 24px}
 #apsan-products-public .aps-qty-stepper button{font-size:18px}
 #apsan-products-public .aps-qty-stepper input{font-size:13px}
 #apsan-products-public .aps-add-button{font-size:11px;min-height:38px;padding:7px 4px}
 #apsan-products-public .aps-card-more{padding:0 9px 10px}
 #apsan-products-public .aps-detail-link{font-size:10px}
}


/* APSAN storefront option 1: compact green promotion badge, favorites and stock */
#apsan-products-public .aps-photo{position:relative;background:#fff!important;height:clamp(155px,28vw,285px)!important;padding:12px!important}
#apsan-products-public .aps-promo-badge{position:absolute;z-index:3;left:12px;top:12px;display:inline-flex;align-items:center;gap:6px;background:#159b32;color:#fff;border-radius:24px;padding:7px 12px;font-size:12px;font-weight:850;letter-spacing:0;box-shadow:0 3px 9px #0002;text-transform:none}
#apsan-products-public .aps-favorite{position:absolute;z-index:4;right:12px;top:12px;width:38px;height:38px;border:0;border-radius:50%;background:#fff;color:#102e69;display:grid;place-items:center;font-size:20px;box-shadow:0 2px 9px #102b4d20;cursor:pointer}
#apsan-products-public .aps-favorite.active{color:#e21d45}
#apsan-products-public .aps-favorite.active i{font-weight:900}
#apsan-products-public .aps-rating{display:flex;align-items:center;gap:7px;font-size:12px;color:#64748b;margin:7px 0}
#apsan-products-public .aps-stars{color:#f5ad08;letter-spacing:1px;font-size:17px}
#apsan-products-public .aps-stock{display:inline-flex;align-items:center;gap:6px;margin:7px 0 3px;padding:6px 10px;border-radius:10px;font-size:12px;font-weight:800}
#apsan-products-public .aps-stock.available{background:#e4f8e9;color:#137b31}
#apsan-products-public .aps-stock.empty{background:#fff0f0;color:#c62828}
#apsan-products-public .aps-stock.pending{background:#fff7df;color:#8b6500}
#apsan-products-public .aps-sale-ribbon{display:none!important}
#apsan-products-public .aps-price{color:#092d73!important}
#apsan-products-public .aps-card-more{justify-content:center!important}
#apsan-products-public .aps-detail-link{font-size:13px!important}
#apsan-products-public .aps-add-button:disabled{opacity:.48;cursor:not-allowed}
#apsan-products-public .aps-benefits{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:28px 0 6px;padding:17px 8px;background:#fff;border:1px solid #e0e8f2;border-radius:18px;box-shadow:0 5px 18px #092b500c}
#apsan-products-public .aps-benefit{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;padding:4px 8px;color:#092d60;font-size:12px;font-weight:650;line-height:1.35}
#apsan-products-public .aps-benefit+.aps-benefit{border-left:1px solid #dce5ef}
#apsan-products-public .aps-benefit i{font-size:23px;color:#0757b8}
@media(max-width:560px){
 #apsan-products-public .aps-photo{height:clamp(125px,39vw,190px)!important;padding:7px!important}
 #apsan-products-public .aps-promo-badge{left:8px;top:8px;padding:6px 9px;font-size:10px}
 #apsan-products-public .aps-favorite{right:8px;top:8px;width:32px;height:32px;font-size:17px}
 #apsan-products-public .aps-rating{font-size:10px;gap:4px}
 #apsan-products-public .aps-stars{font-size:14px}
 #apsan-products-public .aps-stock{font-size:10px;padding:5px 7px;margin:5px 0 2px}
 #apsan-products-public .aps-benefits{grid-template-columns:repeat(4,minmax(0,1fr));margin:22px 0 5px;padding:12px 3px}
 #apsan-products-public .aps-benefit{font-size:9px;padding:3px 4px}
 #apsan-products-public .aps-benefit i{font-size:18px}
}


/* Homepage: two published products visible, rotating one position every 3 seconds */
#apsan-products-public.aps-home-catalogue{max-width:1200px!important;margin:26px auto 34px!important;padding:24px 14px 28px!important;background:#f2f6fb!important;border-radius:22px!important}
#apsan-products-public .aps-home-feature-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 18px}
#apsan-products-public .aps-home-feature-head h2{font-size:clamp(22px,3vw,34px);margin:7px 0 0;color:#101f55;display:flex;align-items:center;gap:10px}
#apsan-products-public .aps-home-feature-head h2 i{font-size:.82em}
#apsan-products-public .aps-home-more-link{display:inline-flex;align-items:center;gap:7px;color:#092d60;text-decoration:none!important;font-weight:850;white-space:nowrap}
#apsan-products-public .aps-home-product-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px!important;transition:opacity .25s ease,transform .25s ease}
#apsan-products-public .aps-home-product-grid.is-changing{opacity:0;transform:translateY(7px)}
#apsan-products-public .aps-home-carousel-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:14px;color:#718096;font-size:12px}
#apsan-products-public .aps-home-carousel-dots{display:flex;align-items:center;gap:6px}
#apsan-products-public .aps-home-carousel-dots button{width:8px;height:8px;padding:0;border:0;border-radius:50%;background:#bdc8d7;cursor:pointer}
#apsan-products-public .aps-home-carousel-dots button.active{width:21px;border-radius:9px;background:#0757b8}
#apsan-products-public .aps-home-more{display:flex;justify-content:center;margin:18px 0}
#apsan-products-public .aps-home-more a{display:inline-flex;gap:9px;align-items:center;background:#0757b8;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:800}
@media(max-width:560px){
 #apsan-products-public.aps-home-catalogue{margin:18px 10px 25px!important;padding:18px 9px 20px!important;border-radius:17px!important}
 #apsan-products-public .aps-home-feature-head{margin-bottom:13px}
 #apsan-products-public .aps-home-feature-head h2{font-size:20px}
 #apsan-products-public .aps-home-more-link{font-size:12px;gap:4px}
 #apsan-products-public .aps-home-product-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
 #apsan-products-public .aps-home-carousel-footer{font-size:10px;margin-top:11px}
}

`;document.head.appendChild(s)}
function host(){let el=document.getElementById("apsan-products-public");if(el)return el;el=document.createElement("section");el.id="apsan-products-public";const footer=document.querySelector("footer.apsan-footer,footer");if(footer)footer.insertAdjacentElement("beforebegin",el);else document.body.appendChild(el);return el}
function waLink(p){let n=String(p.whatsapp||"").replace(/\D/g,"");if(n.startsWith("0"))n=n.slice(1);if(n.length===9)n="244"+n;return n?"https://wa.me/"+n+"?text="+encodeURIComponent("Olá, APSAN! Tenho interesse no anúncio: "+p.name+". Gostaria de mais informações."):""}
async function loadManagedVideos(){try{const api="https://api.github.com/repos/mateus-max/Website-Management/contents/content/videos?ref=main";const res=await fetch(api,{cache:"no-store",headers:{Accept:"application/vnd.github+json"}});if(!res.ok)return[];const files=await res.json();const rows=await Promise.all(files.filter(f=>f.type==="file"&&/\.md$/i.test(f.name)).map(async f=>{const r=await fetch(f.download_url+"?v="+Date.now(),{cache:"no-store"});if(!r.ok)return null;const raw=await r.text(),m=raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/),data={};if(m)m[1].split(/\r?\n/).forEach(line=>{const x=line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);if(x)data[x[1]]=x[2].trim().replace(/^['"]|['"]$/g,"")});return data}));return rows.filter(x=>x&&["true","yes","1"].includes(String(x.published||"").toLowerCase())&&youtubeId(x.url))}catch(e){console.warn("[APSAN videos]",e);return[]}}
function youtubeId(url){try{const u=new URL(url);if(u.hostname.includes("youtu.be"))return u.pathname.slice(1).split("/")[0];if(u.hostname.includes("youtube.com"))return u.searchParams.get("v")||(u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)||[])[1]}catch(e){}return""}
function renderManagedVideos(rows){const existing=document.getElementById("apsan-managed-videos");if(existing)existing.remove();const section=document.createElement("section");section.id="apsan-managed-videos";section.innerHTML='<div class="aps-head"><h2>Vídeos da APSAN</h2><p>Conheça os nossos serviços, actividades e novidades em vídeo.</p></div><div class="aps-video-grid">'+rows.map(v=>{const id=youtubeId(v.url);return '<article class="aps-video-card"><div class="aps-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'" title="'+esc(v.title||"Vídeo APSAN")+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="aps-video-copy"><h3>'+esc(v.title||"Vídeo APSAN")+'</h3><p>'+esc(v.description||"")+'</p></div></article>'}).join("")+'</div>'+(rows.length?'':'<div class="aps-video-empty"><strong>Ainda não existem vídeos publicados.</strong><p>Os vídeos adicionados no Web Management aparecerão aqui depois de serem publicados.</p></div>');const s=document.createElement("style");s.textContent='#apsan-managed-videos{max-width:1200px;margin:38px auto 26px;padding:32px 18px;border-top:1px solid #dce5ef}#apsan-managed-videos .aps-head{text-align:center;margin-bottom:22px}#apsan-managed-videos .aps-head h2{color:#10243e;font-size:clamp(24px,3vw,34px);margin:0 0 8px}#apsan-managed-videos .aps-head p{color:#64748b}#apsan-managed-videos .aps-video-empty{padding:22px;text-align:center;border:1px dashed #cbd8e7;border-radius:14px;background:#f7faff;color:#173b68}#apsan-managed-videos .aps-video-empty p{margin-top:6px;color:#64748b}#apsan-managed-videos .aps-video-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:18px}#apsan-managed-videos .aps-video-card{border:1px solid #dce5ef;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 8px 24px #102b4d0d}#apsan-managed-videos .aps-video-frame{aspect-ratio:16/9;background:#071b31}#apsan-managed-videos iframe{width:100%;height:100%;border:0}#apsan-managed-videos .aps-video-copy{padding:14px 16px;color:#172b43}#apsan-managed-videos h3{margin:0 0 7px;font-size:17px}#apsan-managed-videos p{margin:0;color:#64748b;line-height:1.5}@media(max-width:560px){#apsan-managed-videos{padding:24px 14px}#apsan-managed-videos .aps-video-grid{grid-template-columns:1fr}}';document.head.appendChild(s);const productSection=host();productSection.insertAdjacentElement("beforebegin",section)}
let activeFilter="all",searchQuery="",currentPage=1;const pageSize=6;
let homeSlideIndex=0,homeCarouselTimer=null,homeFadeTimer=null;
function visibleRows(){return Object.entries(products).filter(([id,p])=>{p=p||{};const st=String(p.status||"").trim().toLowerCase(),live=p.published===true||p.published==="true"||["active","published","publicado","publicada"].includes(st);if(!live)return false;const type=String(p.productType||"").toLowerCase();if(activeFilter==="products"&&!["physical","digital"].includes(type))return false;if(activeFilter==="services"&&!["service","course"].includes(type))return false;const q=searchQuery.toLowerCase();return !q||[p.name,p.category,p.description,p.province,p.municipality].join(" ").toLowerCase().includes(q)}).sort((a,b)=>(Number(b[1].updatedAt||b[1].createdAt)||0)-(Number(a[1].updatedAt||a[1].createdAt)||0))}
function renderHomeProducts(){
 const el=host();
 const rows=Object.entries(products).filter(([id,p])=>{
  p=p||{};const st=String(p.status||"").trim().toLowerCase();
  const live=p.published===true||p.published==="true"||["active","published","publicado","publicada"].includes(st);
  const type=String(p.productType||"").toLowerCase();
  return p&&live&&["physical","digital"].includes(type);
 }).sort((a,b)=>(Number(b[1].updatedAt||b[1].createdAt)||0)-(Number(a[1].updatedAt||a[1].createdAt)||0));
 if(!rows.length){
  el.innerHTML='<div class="aps-home-feature-head"><div><span class="aps-kicker">CATÁLOGO APSAN</span><h2><i class="fas fa-basket-shopping"></i> Produtos em Destaque</h2></div></div><div class="aps-empty">Ainda não existem produtos publicados.</div><div class="aps-home-more"><a href="produtos.html">Ver mais produtos <i class="fas fa-arrow-right"></i></a></div>';
  if(homeCarouselTimer){clearInterval(homeCarouselTimer);homeCarouselTimer=null}
  return;
 }
 homeSlideIndex=homeSlideIndex%rows.length;
 const chosen=[rows[homeSlideIndex],...(rows.length>1?[rows[(homeSlideIndex+1)%rows.length]]:[])];
 const first=homeSlideIndex+1,last=Math.min(homeSlideIndex+2,rows.length);
 el.classList.add("aps-home-catalogue");
 el.innerHTML='<div class="aps-home-feature-head"><div><span class="aps-kicker">CATÁLOGO APSAN</span><h2><i class="fas fa-basket-shopping"></i> Produtos em Destaque</h2></div><a class="aps-home-more-link" href="produtos.html">Ver mais produtos <i class="fas fa-arrow-right"></i></a></div><div class="aps-home-product-grid" aria-live="polite">'+chosen.map(([id,p])=>card(id,p)).join("")+'</div><div class="aps-home-carousel-footer"><span>A mostrar '+(rows.length===1?"1":first+"–"+last)+' de '+rows.length+' produtos</span><div class="aps-home-carousel-dots">'+rows.map((row,i)=>'<button type="button" data-home-slide="'+i+'" class="'+(i===homeSlideIndex?"active":"")+'" aria-label="Mostrar produtos a partir da posição '+(i+1)+'"></button>').join("")+'</div></div>';
 el.onclick=e=>{
  const dot=e.target.closest("[data-home-slide]");
  if(dot){homeSlideIndex=Number(dot.dataset.homeSlide)||0;renderHomeProducts();return}
  clickAction(e);
 };
 if(rows.length>2&&!homeCarouselTimer){
  homeCarouselTimer=setInterval(()=>{
   const current=host();
   if(!current||!current.isConnected)return;
   const grid=current.querySelector(".aps-home-product-grid");
   if(grid)grid.classList.add("is-changing");
   if(homeFadeTimer)clearTimeout(homeFadeTimer);
   homeFadeTimer=setTimeout(()=>{homeSlideIndex=(homeSlideIndex+1)%rows.length;renderHomeProducts()},260);
  },3000);
 }else if(rows.length<=2&&homeCarouselTimer){clearInterval(homeCarouselTimer);homeCarouselTimer=null}
}
function render(){addStyles();const el=host();if(el.dataset.homeCarousel==="true"){renderHomeProducts();return}const all=Object.entries(products).filter(([id,p])=>{p=p||{};const st=String(p.status||"").trim().toLowerCase();return p&&(p.published===true||p.published==="true"||["active","published","publicado","publicada"].includes(st))}),prodCount=all.filter(x=>["physical","digital"].includes(String(x[1].productType||"").toLowerCase())).length,servCount=all.filter(x=>["service","course"].includes(String(x[1].productType||"").toLowerCase())).length,rows=visibleRows(),pages=Math.max(1,Math.ceil(rows.length/pageSize));currentPage=Math.min(currentPage,pages);const shown=rows.slice((currentPage-1)*pageSize,currentPage*pageSize);el.innerHTML='<div class="aps-feature-head"><div><span class="aps-kicker">CATÁLOGO APSAN</span><h2><i class="fas fa-basket-shopping"></i> Produtos em Destaque</h2></div><a class="aps-see-all" href="produtos.html">Ver todos <i class="fas fa-arrow-right"></i></a></div><div class="aps-toolbar"><input class="aps-search" id="apsProductSearch" value="'+esc(searchQuery)+'" placeholder="Pesquisar produtos e serviços…"><div class="aps-filters"><button class="aps-filter '+(activeFilter==="all"?"active":"")+'" data-aps-filter="all">Todos ('+all.length+')</button><button class="aps-filter '+(activeFilter==="products"?"active":"")+'" data-aps-filter="products">Produtos ('+prodCount+')</button><button class="aps-filter '+(activeFilter==="services"?"active":"")+'" data-aps-filter="services">Serviços ('+servCount+')</button></div></div>'+'<div class="aps-grid" id="apsProductGrid">'+(shown.length?shown.map(([id,p])=>card(id,p)).join(""):'<div class="aps-empty"><strong>Não foram encontrados anúncios.</strong><br>Experimente outro filtro ou termo de pesquisa.</div>')+'</div>'+(rows.length>pageSize?'<div class="aps-pagination"><button class="aps-page" data-aps-page="'+(currentPage-1)+'" '+(currentPage===1?"disabled":"")+'>‹ Anterior</button>'+Array.from({length:pages},(_,i)=>'<button class="aps-page '+(currentPage===i+1?"active":"")+'" data-aps-page="'+(i+1)+'">'+(i+1)+'</button>').join("")+'<button class="aps-page" data-aps-page="'+(currentPage+1)+'" '+(currentPage===pages?"disabled":"")+' >Seguinte ›</button></div>':"")+'<div class="aps-benefits"><div class="aps-benefit"><i class="fas fa-truck-fast"></i><span>Entrega rápida</span></div><div class="aps-benefit"><i class="fas fa-shield-halved"></i><span>Compra segura</span></div><div class="aps-benefit"><i class="fas fa-headset"></i><span>Suporte online</span></div><div class="aps-benefit"><i class="far fa-credit-card"></i><span>Vários métodos de pagamento</span></div></div>';el.onclick=e=>{const f=e.target.closest("[data-aps-filter]"),pg=e.target.closest("[data-aps-page]");if(f){activeFilter=f.dataset.apsFilter;currentPage=1;render();return}if(pg&&!pg.disabled){currentPage=Number(pg.dataset.apsPage);render();return}clickAction(e)};const search=el.querySelector("#apsProductSearch");search.oninput=()=>{searchQuery=search.value;currentPage=1;const pos=search.selectionStart;render();const input=el.querySelector("#apsProductSearch");input.focus();input.setSelectionRange(pos,pos)}}function expandableText(value,cls,limit){const full=String(value||"");const text=full.trim();if(!text)return '<span class="'+cls+'">Sem descrição disponível.</span>';const short=text.length>limit?text.slice(0,limit).trimEnd()+"…":text;return '<div class="aps-expandable-text '+cls+'" data-expanded="false"><span class="aps-expand-content">'+esc(short)+'</span>'+(text.length>limit?'<button type="button" class="aps-expand-toggle" data-expand-text="'+esc(text)+'" data-limit="'+limit+'" aria-expanded="false">Ver mais <i class="fas fa-chevron-down"></i></button>':'')+'</div>'}
function bindExpandable(root){root.querySelectorAll("[data-expand-text]").forEach(btn=>{btn.onclick=()=>{const box=btn.closest(".aps-expandable-text"),span=box&&box.querySelector(".aps-expand-content");if(!box||!span)return;const expanded=box.dataset.expanded==="true",full=btn.dataset.expandText,limit=Number(btn.dataset.limit)||260;span.textContent=expanded?(full.slice(0,limit).trimEnd()+"…"):full;box.dataset.expanded=expanded?"false":"true";btn.setAttribute("aria-expanded",expanded?"false":"true");btn.innerHTML=expanded?'Ver mais <i class="fas fa-chevron-down"></i>':'Ver menos <i class="fas fa-chevron-up"></i>'}})}
function favoriteIds(){try{return JSON.parse(localStorage.getItem("apsanFavoriteProducts")||"[]")}catch{return []}}
function apsanProductShareUrl(id){
 const url=new URL("/produtos.html",window.location.origin);
 url.searchParams.set("produto",String(id));
 return url.href;
}
async function apsanShareProduct(id,mode,button){
 const p=products[id];if(!p)return;
 const url=apsanProductShareUrl(id),title=String(p.name||"Produto APSAN"),description=String(p.description||"Conheça este produto na APSAN, LDA.");
 if(mode==="copy"){
  try{
   if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(url);
   else{const input=document.createElement("textarea");input.value=url;input.style.position="fixed";input.style.opacity="0";document.body.appendChild(input);input.select();const ok=document.execCommand("copy");input.remove();if(!ok)throw new Error("copy")}
   const previous=button.innerHTML;button.innerHTML='<i class="fas fa-check"></i>';button.classList.add("copied");button.setAttribute("aria-label","Link copiado");
   setTimeout(()=>{button.innerHTML=previous;button.classList.remove("copied");button.setAttribute("aria-label","Copiar link do produto")},1600);
  }catch(e){window.prompt("Copie o link deste produto:",url)}
  return;
 }
 if(navigator.share){try{await navigator.share({title,text:title+" — "+description,url})}catch(e){if(e.name!=="AbortError")window.prompt("Copie o link para partilhar:",url)}}
 else{try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);alert("Link do produto copiado. Já pode partilhá-lo.")}else window.prompt("Copie o link para partilhar:",url)}catch(e){window.prompt("Copie o link para partilhar:",url)}}
}
function card(id,p){
 const sale=Number(p.promoPrice)>0&&Number(p.promoPrice)<Number(p.price),price=sale?p.promoPrice:p.price,img=(Array.isArray(p.images)?p.images[0]:"")||p.image||"",type=String(p.productType||"").toLowerCase(),label=type==="service"?"Serviços":type==="course"?"Cursos e formação":type==="digital"?"Produtos digitais":"Produtos",discount=sale?Math.round((1-Number(p.promoPrice)/Number(p.price))*100):0;
 const physical=type==="physical",stock=Number(p.quantity),stockText=!physical?"":!Number.isFinite(stock)?"Stock por confirmar":stock>0?(stock+" unidade(s) em stock"):"Esgotado",stockClass=!physical?"":!Number.isFinite(stock)?"pending":stock>0?"available":"empty",fav=favoriteIds().includes(String(id));
 const rating=Number(p.averageRating||p.rating),reviews=Number(p.reviewCount||p.reviewsCount),ratingHtml=Number.isFinite(rating)&&rating>0?'<div class="aps-rating"><span class="aps-stars">'+("★".repeat(Math.max(1,Math.min(5,Math.round(rating)))))+'</span><span>'+rating.toFixed(1)+(reviews>0?" ("+reviews+" avaliações)":"")+'</span></div>':"";
 return '<article class="aps-card"><div class="aps-photo">'+(sale?'<span class="aps-promo-badge"><i class="fas fa-fire"></i> Promoção</span>':'')+'<button class="aps-favorite '+(fav?"active":"")+'" type="button" data-aps-favorite="'+esc(id)+'" aria-label="Adicionar aos favoritos" aria-pressed="'+(fav?"true":"false")+'"><i class="'+(fav?"fas":"far")+' fa-heart"></i></button>'+(img?'<img src="'+esc(img)+'" alt="'+esc(p.name)+'" loading="lazy">':'<span class="aps-no-photo"><i class="fas fa-box-open"></i></span>')+'</div><div class="aps-info"><span class="aps-tag">'+esc(p.category||label)+'</span><h3>'+esc(p.name)+'</h3>'+expandableText(p.description||"", "aps-card-description", 105)+ratingHtml+'<div class="aps-price">'+(Number(price)>0?money(price):"Preço sob consulta")+(sale?'<span class="aps-old">'+money(p.price)+'</span><span class="aps-discount">-'+discount+'%</span>':'')+'</div>'+(physical?'<div class="aps-stock '+stockClass+'"><i class="fas '+(stock>0?"fa-circle-check":stock===0?"fa-circle-xmark":"fa-circle-question")+'"></i> '+esc(stockText)+'</div>':'')+'</div><div class="aps-card-buy"><a class="aps-card-whatsapp" href="'+(waLink(p)||"#")+'" '+(waLink(p)?'target="_blank" rel="noopener noreferrer"':'aria-disabled="true"')+' aria-label="Contactar pelo WhatsApp" title="Contactar pelo WhatsApp"><i class="fab fa-whatsapp"></i></a><button class="aps-btn primary aps-add-button" data-aps-buy="'+esc(id)+'" '+(physical&&stock===0?"disabled":"")+'><i class="fas fa-cart-plus"></i> Adicionar</button></div><div class="aps-card-more"><button type="button" class="aps-share-icon" data-aps-share="'+esc(id)+'" aria-label="Partilhar produto" title="Partilhar produto"><i class="fas fa-share-nodes"></i></button><button type="button" class="aps-share-icon" data-aps-copy="'+esc(id)+'" aria-label="Copiar link do produto" title="Copiar link"><i class="fas fa-link"></i></button><button class="aps-detail-link" data-aps-detail="'+esc(id)+'"><i class="far fa-eye"></i> Ver detalhes</button></div></article>'
}
function clickAction(e){
 const share=e.target.closest("[data-aps-share]"),copy=e.target.closest("[data-aps-copy]");
 if(share){apsanShareProduct(share.dataset.apsShare,"share",share);return}
 if(copy){apsanShareProduct(copy.dataset.apsCopy,"copy",copy);return}
 const fav=e.target.closest("[data-aps-favorite]");
 if(fav){const id=String(fav.dataset.apsFavorite),ids=favoriteIds(),next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];try{localStorage.setItem("apsanFavoriteProducts",JSON.stringify(next))}catch{}fav.classList.toggle("active",next.includes(id));fav.setAttribute("aria-pressed",next.includes(id)?"true":"false");fav.innerHTML='<i class="'+(next.includes(id)?"fas":"far")+' fa-heart"></i>';return}
 const step=e.target.closest("[data-qty-step]");
 if(step){const box=step.closest(".aps-card"),input=box&&box.querySelector("[data-aps-card-qty]"),buy=box&&box.querySelector("[data-aps-buy]");if(input){const max=Number(input.max)||Infinity;input.value=String(Math.max(1,Math.min(max,(Number(input.value)||1)+Number(step.dataset.qtyStep))))}return}
 const buy=e.target.closest("[data-aps-buy]"),detail=e.target.closest("[data-aps-detail]");
 if(buy){const box=buy.closest(".aps-card"),qty=Number(box&&box.querySelector("[data-aps-card-qty]")?.value)||1;checkout(buy.dataset.apsBuy,qty);return}
 if(detail)details(detail.dataset.apsDetail)
}
function modal(content){const wrap=document.createElement("div");wrap.className="aps-modal";wrap.innerHTML='<section class="aps-dialog"><button class="aps-close" type="button" aria-label="Fechar">×</button>'+content+'</section>';host().appendChild(wrap);document.body.style.overflow="hidden";const close=()=>{wrap.remove();document.body.style.overflow=""};wrap.querySelector(".aps-close").onclick=close;wrap.addEventListener("click",e=>{if(e.target===wrap)close()});return {wrap,close}}
function details(id){
 const p=products[id];if(!p)return;
 const imgs=[...new Set([...(Array.isArray(p.images)?p.images:[]),p.image].filter(Boolean))];
 const videoId=youtubeId(p.youtubeVideoUrl);
 const galleryItems=[...imgs.map((src)=>({type:"image",src})),...(videoId?[{type:"video",id:videoId}]:[])];
 const wa=waLink(p),sale=Number(p.promoPrice)>0&&Number(p.promoPrice)<Number(p.price);
 const price=sale?p.promoPrice:p.price,discount=sale?Math.round((1-Number(p.promoPrice)/Number(p.price))*100):0;
 const availability=p.productType==="physical"?(Number(p.quantity)>0?Number(p.quantity)+" unidade(s) disponíveis":"Consultar stock"):"Sob consulta";
 const contentText=p.specifications||p.contents||p.content||"Consulte a APSAN para obter informações detalhadas sobre este anúncio.";
 const benefitsText=p.benefits||p.advantages||"Entre em contacto com a nossa equipa para conhecer as vantagens e condições deste produto ou serviço.";
 const m=modal('<div class="aps-detail-top"><div class="aps-detail-heading"><span class="aps-detail-accent"></span><h2>'+esc(p.name)+'</h2></div></div>'+
 '<div class="aps-detail-layout"><div class="aps-detail-gallery">'+
 '<div class="aps-detail-mainimage" id="apsDetailMainMedia">'+(imgs.length?'<img id="apsDetailMainImage" src="'+esc(imgs[0])+'" alt="'+esc(p.name)+'">':'<div class="aps-detail-noimage">Imagem não disponível</div>')+'</div>'+
 ((videoId||imgs.length>1)?'<div class="aps-detail-thumbs">'+galleryItems.map((item,i)=>'<button type="button" class="aps-detail-thumb '+(!i?'active':'')+'" data-aps-gallery="'+i+'" aria-label="'+(item.type==="video"?"Reproduzir vídeo de demonstração":"Ver imagem "+(i+1))+'">'+(item.type==="video"?'<span class="aps-video-thumb"><i class="fab fa-youtube"></i><b>Vídeo</b><span class="aps-video-play">▶</span></span>':'<img src="'+esc(item.src)+'" alt="Imagem '+(i+1)+'">')+'</button>').join('')+'</div>':'')+
 '</div>'+
 (videoId?'<section class="aps-product-demo aps-detail-video-section"><h3><i class="fab fa-youtube"></i> Vídeo de demonstração</h3><div class="aps-product-demo-frame"><iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(videoId)+'" title="Demonstração de '+esc(p.name)+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></section>':'')+
 '<div class="aps-detail-summary"><span class="aps-detail-category"><i class="fas fa-heart-pulse"></i> '+esc(p.category||"APSAN")+'</span><div class="aps-detail-description">'+expandableText(p.description||"Contacte a APSAN para mais informações sobre este anúncio.","aps-detail-description-text",260)+'</div><p class="aps-detail-location"><i class="fas fa-location-dot"></i> '+esc([p.municipality,p.province].filter(Boolean).join(", ")||"Angola")+'</p><div class="aps-detail-pricebox">'+(sale?'<span class="aps-detail-promo">PROMOÇÃO</span>':'')+'<div class="aps-detail-price-row"><strong>'+ (Number(price)>0?money(price):"Preço sob consulta")+'</strong>'+(sale?'<span class="aps-detail-discount">-'+discount+'%</span>':'')+'</div>'+(sale?'<del>'+money(p.price)+'</del>':'')+'</div><div class="aps-detail-stock"><i class="fas fa-circle-check"></i><span><b>Disponibilidade:</b><br>'+esc(availability)+'</span></div></div></div>'+
 '<div class="aps-detail-tabs" role="tablist"><button class="active" type="button" data-aps-tab="description"><i class="fas fa-circle-info"></i> Descrição</button><button type="button" data-aps-tab="content"><i class="fas fa-list-ul"></i> Conteúdo</button><button type="button" data-aps-tab="benefits"><i class="far fa-star"></i> Benefícios</button></div><div class="aps-detail-tabpanel" id="apsDetailTabPanel">'+expandableText(p.description||"Contacte a APSAN para mais informações.","aps-tab-description",320)+'</div>'+
 '<div class="aps-detail-cta"><button class="aps-btn primary" id="apsDetailBuy"><i class="fas fa-cart-shopping"></i> Comprar agora</button><a class="aps-btn wa" href="'+(wa||"#")+'" '+(wa?'target="_blank" rel="noopener"':'aria-disabled="true"')+'><i class="fab fa-whatsapp"></i> Contactar pelo WhatsApp</a></div>');
 const mainMedia=m.wrap.querySelector("#apsDetailMainMedia");
 m.wrap.querySelectorAll("[data-aps-gallery]").forEach(btn=>btn.onclick=()=>{
  const item=galleryItems[Number(btn.dataset.apsGallery)];if(!item||!mainMedia)return;
  if(item.type==="video"){
   mainMedia.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(item.id)+'?autoplay=1" title="Demonstração de '+esc(p.name)+'" loading="eager" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
   mainMedia.classList.add("aps-media-playing");
  }else{
   mainMedia.innerHTML='<img src="'+esc(item.src)+'" alt="'+esc(p.name)+'">';
   mainMedia.classList.remove("aps-media-playing");
  }
  m.wrap.querySelectorAll(".aps-detail-thumb").forEach(x=>x.classList.toggle("active",x===btn));
 });
 const tabData={description:p.description||"Contacte a APSAN para mais informações.",content:contentText,benefits:benefitsText};
 m.wrap.querySelectorAll("[data-aps-tab]").forEach(btn=>btn.onclick=()=>{m.wrap.querySelectorAll("[data-aps-tab]").forEach(x=>x.classList.toggle("active",x===btn));m.wrap.querySelector("#apsDetailTabPanel").innerHTML=expandableText(tabData[btn.dataset.apsTab],"aps-tab-description",320);bindExpandable(m.wrap)});bindExpandable(m.wrap);
 m.wrap.querySelector("#apsDetailBuy").onclick=()=>{m.close();checkout(id)};
}
function readFile(file){return new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(String(r.result));r.onerror=no;r.readAsDataURL(file)})}
function checkout(id,initialQuantity=1){
 const p=products[id],st=String(p?.status||"").trim().toLowerCase();if(!p||!(p.published===true||p.published==="true"||["active","published","publicado","publicada"].includes(st)))return;
 const price=Number(p.promoPrice||p.price),sale=Number(p.promoPrice)>0&&Number(p.promoPrice)<Number(p.price);
 const m=modal('<div class="aps-checkout"><div class="aps-checkout-brand"><img src="https://apsanlda.com/logo.jpeg" alt="APSAN"><div><b>APSAN, LDA</b><small>A PRESTADORA DE SERVIÇOS</small></div><span class="aps-secure"><i class="fas fa-lock"></i> Checkout seguro</span></div><div class="aps-checkout-hero"><span><i class="fas fa-cart-shopping"></i></span><div><h2>Finalizar encomenda</h2><p>Preencha os seus dados, envie o comprovativo e acompanhe a sua encomenda pelo WhatsApp.</p></div></div><div class="aps-checkout-product"><div class="aps-checkout-product-image">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.name)+'">':'<i class="fas fa-box"></i>')+'</div><div class="aps-checkout-product-info"><small>O SEU PEDIDO</small><b>'+esc(p.name)+'</b><span>'+(p.category?esc(p.category):"Produto / serviço APSAN")+'</span></div><div class="aps-checkout-product-price"><small>Preço unitário</small><b>'+money(price)+'</b>'+(sale?'<del>'+money(p.price)+'</del>':'')+'</div></div><form id="apsCheckout" class="aps-checkout-form"><div class="aps-checkout-columns"><div class="aps-checkout-left"><section class="aps-checkout-section"><h3><i class="fas fa-user"></i> Dados do cliente</h3><div class="aps-field"><label>Nome completo *</label><input name="name" autocomplete="name" placeholder="Digite o seu nome completo" required></div><div class="aps-field"><label>E-mail (opcional)</label><input name="email" type="email" autocomplete="email" placeholder="seuemail@exemplo.com"></div><div class="aps-field"><label>Número WhatsApp *</label><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+244 9XX XXX XXX" required minlength="9"><small>Este número será utilizado para confirmar a compra, o pagamento e acompanhar a realização do serviço.</small></div><div class="aps-formgrid"><div class="aps-field"><label>País *</label><select name="country"><option value="AO">Angola</option><option value="NA">Namíbia</option></select></div><div class="aps-field"><label>Quantidade *</label><input name="qty" type="number" min="1" value="1" required></div><div class="aps-field"><label>Província / região *</label><input name="province" placeholder="Ex.: Luanda" required></div><div class="aps-field"><label>Município / cidade *</label><input name="city" placeholder="Ex.: Talatona" required></div></div><div class="aps-field"><label>Endereço / localidade *</label><textarea name="address" placeholder="Bairro, rua, número ou ponto de referência" required></textarea></div><div class="aps-field"><label>Observações (opcional)</label><textarea name="notes" placeholder="Informações adicionais sobre a sua encomenda"></textarea></div></section></div><div class="aps-checkout-right"><section class="aps-checkout-section"><h3><i class="fas fa-receipt"></i> Resumo da encomenda</h3><div class="aps-checkout-summary"><div><span>Subtotal</span><b id="apsSubtotal"></b></div><div id="apsTaxRow"><span>Taxas</span><b id="apsTax"></b></div><div class="aps-checkout-total"><span>Total a pagar</span><b id="apsTotal"></b></div></div></section><section class="aps-checkout-section"><h3><i class="fas fa-credit-card"></i> Método de pagamento</h3><div id="apsCheckoutPay" class="aps-paybox"></div></section><section class="aps-checkout-section"><h3><i class="fas fa-paperclip"></i> Comprovativo de pagamento *</h3><label class="aps-upload"><i class="fas fa-cloud-arrow-up"></i><b>Selecionar ficheiro</b><span>Imagem ou PDF · Máximo 1,5 MB</span><input name="proof" type="file" accept="image/*,application/pdf" required></label><small class="aps-file-name" id="apsFileName">Nenhum ficheiro selecionado</small></section><div class="aps-checkout-whatsapp"><i class="fab fa-whatsapp"></i><div><b>Acompanhamento pelo WhatsApp</b><p>Depois de registar a encomenda, poderá enviar a mensagem de confirmação. A APSAN acompanhará a validação do pagamento e a conclusão do serviço.</p></div></div><div id="apsCheckoutMsg"></div><button class="aps-btn primary aps-checkout-submit" type="submit"><i class="fas fa-check-circle"></i> Confirmar encomenda</button></div></div></form><div class="aps-checkout-trust"><span><i class="fas fa-shield-halved"></i> Compra segura</span><span><i class="fab fa-whatsapp"></i> Apoio via WhatsApp</span><span><i class="fas fa-headset"></i> Suporte APSAN</span></div></div>');
 const form=m.wrap.querySelector("#apsCheckout"),pay=m.wrap.querySelector("#apsCheckoutPay"),country=form.elements.country,qty=form.elements.qty;
 form.elements.qty.value=String(Math.max(1,Number(initialQuantity)||1));
 let selectedMethod=country.value==="NA"?"ewallet":"bank";
 const waCompany=String(p.whatsapp||"244944403093").replace(/\D/g,"");
 form.elements.proof.addEventListener("change",()=>{m.wrap.querySelector("#apsFileName").textContent=form.elements.proof.files[0]?.name||"Nenhum ficheiro selecionado"});
 function updatePay(){
  const na=country.value==="NA",total=price*Math.max(1,Number(qty.value)||1),tax=na?total*.16:0,payable=total+tax;
  if(na)selectedMethod="ewallet";else if(selectedMethod==="ewallet")selectedMethod="bank";
  m.wrap.querySelector("#apsSubtotal").textContent=na?fmtNAD(total/68):money(total);
  m.wrap.querySelector("#apsTax").textContent=na?fmtNAD(tax/68):money(0);
  m.wrap.querySelector("#apsTaxRow").style.display=na?"flex":"none";
  m.wrap.querySelector("#apsTotal").textContent=na?fmtNAD(payable/68):money(payable);
  pay.innerHTML=na?'<div class="aps-pay-method-title"><i class="fas fa-wallet"></i> Pagamento E-wallet (NAD)</div><p>Total produtos: <b>'+fmtNAD(total/68)+'</b></p><p>Taxa alfandegária (16%): <b>'+fmtNAD(tax/68)+'</b></p><p>Número E-wallet: <b>0812194801</b></p><small>Taxa de referência: 1 NAD = 68 AOA.</small>':'<div class="aps-pay-method-title"><i class="fas fa-building-columns"></i> Pagamento — Angola</div><label class="aps-pay-option"><input type="radio" name="apsPayMethod" value="bank" '+(selectedMethod==="bank"?"checked":"")+'><span><b>Transferência bancária</b><small>Pagamento por transferência</small></span></label><label class="aps-pay-option"><input type="radio" name="apsPayMethod" value="express" '+(selectedMethod==="express"?"checked":"")+'><span><b>EXPRESS</b><small>Pagamento por Multicaixa Express</small></span></label>'+(selectedMethod==="bank"?'<div class="aps-bank-details"><small>Titular da conta</small><b>APSAN, LDA</b><small>IBAN</small><b>0006 0000 63503021301 57</b></div>':'<div class="aps-bank-details"><small>Número EXPRESS</small><b>931057760</b></div>');
  return {na,total,tax,payable};
 }
 pay.onchange=e=>{if(e.target.name==="apsPayMethod"){selectedMethod=e.target.value;updatePay()}};
 country.onchange=updatePay;qty.oninput=updatePay;updatePay();
 form.onsubmit=async e=>{
  e.preventDefault();
  const msg=m.wrap.querySelector("#apsCheckoutMsg"),file=form.elements.proof.files[0],q=Number(qty.value),buyerWhatsapp=form.elements.phone.value.trim();
  const digits=buyerWhatsapp.replace(/\D/g,"");
  if(digits.length<9){msg.innerHTML='<div class="aps-message aps-message-error">Introduza um número WhatsApp válido, incluindo o indicativo do país.</div>';form.elements.phone.focus();return}
  if(!file||file.size>1572864){msg.innerHTML='<div class="aps-message aps-message-error">Carregue um comprovativo válido até 1,5 MB.</div>';return}
  if(!Number.isInteger(q)||q<1||(p.productType==="physical"&&Number(p.quantity)>0&&q>Number(p.quantity))){msg.innerHTML='<div class="aps-message aps-message-error">Quantidade indisponível em stock.</div>';return}
  const btn=form.querySelector("button[type=submit]");btn.disabled=true;btn.textContent="A registar encomenda…";
  try{
   const totals=updatePay(),proof=await readFile(file),now=Date.now(),orderRef=push(ref(db,"apsanOrders"));
   const paymentMethod=selectedMethod==="ewallet"?"E-wallet":selectedMethod==="express"?"EXPRESS":"Transferência Bancária";
   const order={productId:id,productName:p.name,quantity:q,unitPrice:price,totalAOA:totals.total,customsTaxAOA:totals.tax,totalWithCustomsAOA:totals.payable,currency:totals.na?"NAD":"AOA",paymentAmount:totals.na?Number((totals.payable/68).toFixed(2)):totals.payable,paymentMethod,buyerName:form.elements.name.value.trim(),buyerPhone:buyerWhatsapp,buyerWhatsapp,buyerEmail:form.elements.email.value.trim(),deliveryCountry:totals.na?"Namíbia":"Angola",deliveryProvince:form.elements.province.value.trim(),deliveryMunicipality:form.elements.city.value.trim(),deliveryAddress:form.elements.address.value.trim(),notes:form.elements.notes.value.trim(),paymentStatus:"awaiting_confirmation",status:"pending_payment",createdAt:now,updatedAt:now};
   await set(orderRef,order);
   await set(ref(db,"apsanPaymentProofs/"+orderRef.key),{orderId:orderRef.key,fileName:file.name,mimeType:file.type,size:file.size,data:proof,status:"submitted",submittedAt:now});
   await update(ref(db,"apsanOrders/"+orderRef.key),{proofStatus:"submitted"});
   const totalText=totals.na?fmtNAD(totals.payable/68):money(totals.payable);
   const waText="Olá, APSAN, LDA! Registei uma encomenda no vosso site.\n\nReferência: "+orderRef.key+"\nCliente: "+order.buyerName+"\nWhatsApp: "+buyerWhatsapp+"\nProduto/serviço: "+p.name+"\nQuantidade: "+q+"\nTotal: "+totalText+"\nPagamento: "+paymentMethod+"\nEstado: comprovativo enviado; aguardo confirmação do pagamento.\n\nPeço o acompanhamento da encomenda até à conclusão do serviço. Obrigado.";
   msg.innerHTML='<div class="aps-success"><div class="aps-success-icon"><i class="fas fa-check"></i></div><h3>Encomenda registada!</h3><p>Recebemos os seus dados e o comprovativo. O pagamento ainda aguarda validação da APSAN.</p><div class="aps-reference">Referência da encomenda<b>'+esc(orderRef.key)+'</b></div><p>Confirme agora o contacto pelo WhatsApp para acompanhar a compra, a validação do pagamento e a realização do serviço.</p><a class="aps-btn wa aps-wa-confirm" href="https://wa.me/'+waCompany+'?text='+encodeURIComponent(waText)+'" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Enviar confirmação pelo WhatsApp</a></div>';
   form.querySelectorAll("input,select,textarea,button").forEach(el=>{if(!el.closest(".aps-success"))el.disabled=true});
  }catch(err){msg.innerHTML='<div class="aps-message aps-message-error">Não foi possível registar a encomenda: '+esc(err.message)+'</div>';btn.disabled=false;btn.textContent="Confirmar encomenda"}
 };
}
let apsanSharedProductOpened=false;
onValue(ref(db,"apsanProducts"),snap=>{products=snap.val()||{};render();if(!apsanSharedProductOpened){const sharedId=new URLSearchParams(location.search).get("produto");if(sharedId&&products[sharedId]&&(products[sharedId].published===true||products[sharedId].published==="true"||["active","published","publicado","publicada"].includes(String(products[sharedId].status||"").toLowerCase()))){apsanSharedProductOpened=true;details(sharedId);}}},err=>{console.error("[APSAN Store]",err);const el=host();el.innerHTML="<p class=\"aps-muted\">Não foi possível carregar os anúncios neste momento.</p>"});
document.addEventListener("DOMContentLoaded",()=>{addStyles();host()});
