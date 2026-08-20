# Mimi 🤍

فضای شخصی و فانتزی برای خاطره‌ها.

## ساختار

```
/
├── index.html          # صفحه اصلی عمومی
├── private.html        # اتاق خاطره‌ها (خصوصی)
├── send-photo.html     # ارسال عکس به تلگرام
├── css/
│   ├── main.css
│   ├── private.css
│   ├── send-photo.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js         # لاجیک صفحه اصلی + رمز
│   ├── private.js      # تب‌ها، گالری، پلیرها
│   ├── send-photo.js   # ارسال عکس (Telegram Bot)
│   ├── storage.js      # localStorage
│   └── media.js        # داده‌های مدیا
└── assets/
    ├── images/
    ├── videos/
    ├── audio/
    └── icons/
```

## ارسال عکس (Telegram)

در فایل `js/send-photo.js` این دو مقدار را پر کن:

- `BOT_TOKEN` از @BotFather
- `CHAT_ID` آیدی عددی چت مقصد

از صفحه اصلی دکمه «ارسال عکس برای شوهرم» به این صفحه می‌رود.
فقط دو دکمه دارد: آپلود عکس و دوربین.

## رمز ورود (Demo)

رمز فعلی برای ورود به فضای خصوصی: **925**

> این فقط یک Client-side gate است و امنیت واقعی فراهم نمی‌کند.

## اجرا

روی GitHub Pages یا هر static host:

1. کل پوشه را آپلود کنید.
2. `index.html` را باز کنید.
3. روی قفل بزنید و رمز `925` را وارد کنید تا به `private.html` بروید.

برای تست محلی:

```bash
# با هر static server ساده
npx serve .
# یا
python -m http.server 8080
```

## اضافه کردن مدیا

فایل‌های واقعی را در این مسیرها قرار دهید و در `js/media.js` مسیرها را هماهنگ کنید:

- `assets/videos/` → ویدیوها
- `assets/images/` → عکس‌ها و thumbnailها
- `assets/audio/` → فایل‌های صوتی

اگر فایل وجود نداشته باشد، Empty State یا Placeholder نمایش داده می‌شود و صفحه crash نمی‌کند.

## ویژگی‌ها

- Mobile-first و Responsive
- Password modal با shake روی رمز اشتباه
- انتقال واقعی به صفحه خصوصی
- تب‌های ویدیو / عکس / ویس / نوشته
- Lightbox عکس
- Video player
- Audio player با progress
- Reading view برای نوشته‌ها
- انیمیشن ورود نرم
- localStorage برای آخرین بخش
- پشتیبانی از `prefers-reduced-motion`
- بدون وابستگی به Backend

## نکته امنیتی

رمز در Front-End قابل مشاهده است. برای اطلاعات حساس حتماً Backend Authentication اضافه کنید.
