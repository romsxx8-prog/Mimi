/**
 * Mimi - Media data & helpers
 * Assets live in ./assets/ — empty states shown when files missing
 * Dates use Persian (Jalali) style for demo
 */

const MediaData = (() => {
  // Demo content. Real files should be placed in assets/ folders.
  // Paths are relative for GitHub Pages compatibility.

  const videos = [
    {
      id: 'v1',
      title: 'دلقک بازی شماره 1',
      date: '1405/05/28',
      duration: '0:05',
      src: './assets/videos/1787170232799.mp4',
    },
    {
      id: 'v2',
      title: 'دلقک بازی شماره 2',
      date: '1405/05/28',
      duration: '0:04',
      src: './assets/videos/1787170374999.mp4',
      thumb: './assets/images/thumb-v2.jpg'
    },
    {
      id: 'v3',
      title: 'دلقک بازی شماره 3',
      date: '1405/05/28',
      duration: '0:03',
      src: './assets/videos/1787170458912.mp4',
      thumb: './assets/images/thumb-v3.jpg'
    },
    {
      id: 'v4',
      title: 'ذلقک بازی شماره 4',
      date: '1405/05/28',
      duration: '0:04',
      src: './assets/videos/1787170536981.mp4',
      thumb: './assets/images/thumb-v4.jpg'
    }
  ];

  const photos = [
    {
      id: 'p1',
      title: 'فقط به عشق خودت جیگرم😝❤',
      date: '1405/05/28',
      src: './assets/images/Picsart_26-06-18_17-46-36-014.png',
      
    },
    {
      id: 'p2',
      title: 'یه عکس معمولی🤣',
      date: '1405/05/28',
      src: './assets/images/Picsart_26-06-09_10-12-48-223.png',
      
    },
    {
      id: 'p3',
      title: 'در اینجا کسخل شدم🤣💖',
      date: '1405/05/28',
      src: './assets/images/InShot_20260819_152845866.jpg',
      
    },
    {
      id: 'p4',
      title: 'مثلا به رخ کشیدن بدنی که ندارمش😂🤫',
      date: '1405/05/28',
      src: './assets/images/InShot_20260819_152729112.jpg',
      
    },
    {
      id: 'p5',
      title: 'فیس شوهرت🤭',
      date: '1405/05/28',
      src: './assets/images/IMG_20260819_151022.jpg',
    
    },
    {
      id: 'p6',
      title: 'همین الان یهویی😂',
      date: '1405/05/29',
      src: './assets/images/1.jpg',
      
    },
    {
      id: 'p7',
      title: 'همین الان یهویی😂',
      date: '1405/05/29',
      src: './assets/images/2.jpg',
      
    },
    {
      id: 'p8',
      title: 'همین الان یهویی😂',
      date: '1405/05/29',
      src: './assets/images/3.jpg',
      
    },
    {
      id: 'p9',
      title: 'همین الان یهویی😂',
      date: '1405/05/29',
      src: './assets/images/4.jpg',
      
    },
    {
      id: 'p10',
      title: 'همین الان یهویی😂',
      date: '1405/05/29',
      src: './assets/images/5.jpg',
      
    },
    {
      id: 'p11',
      title: 'همین الان یهویی😂',
      date: '1405/05/29',
      src: './assets/images/6.jpg',
      
    },
    {
      id: 'p12',
      title: 'همین الان یهویی😂',
      date: '1405/05/29',
      src: './assets/images/7.jpg',
      
    },
    {
      id: 'p13',
      title: 'خیخیخی سیسو نگاه😂💖',
      date: '1405/06/01',
      src: './assets/images/9.jpg',
      
    },
    {
      id: 'p14',
      title: 'دوربینم کیفیتش پایینه😭😭😭',
      date: '1405/06/01',
      src: './assets/images/10.jpg',
      
    },
  ];

  const voices = [
    {
      id: 'a1',
      title: 'صدای خودم 1',
      date: '1405/05/28',
      duration: '01:17',
      src: './assets/audio/یاسین 1.m4a'
    },
    {
      id: 'a2',
      title: 'صدای خودم 2',
      date: '1405/05/28',
      duration: '01:34',
      src: './assets/audio/یاسین 2.m4a'
    },
    {
      id: 'a3',
      title: 'صدای خودم 3',
      date: '1405/05/28',
      duration: '02:15',
      src: './assets/audio/یاسین 3.m4a'
    },
    {
      id: 'a4',
      title: 'ویس عذرخواهی',
      date: '1405/05/29',
      duration: '04:48',
      src: './assets/audio/aaa.m4a'
    }
  ];

  const texts = [
    {
      id: 't1',
      title: 'خوش آمدگویی برای دخمل نازم😍🐣',
      date: '1405/05/28',
      body: 'بچهههه جون خوشحالم که تونستی اینجا وارد بشییی و اینجا یه اتاق شخصی بین من و توعه\n\nهروقت که دلت گرفت یا ناراحت شدی زودی بیاا اینجا و اصلا هم نبینم داری گریه میکنیاا بی ادب باش؟😉💞\n\nهربارمم آپدیت میشه  و چیزایی جدید اضافه میشن خوشگلم...'
    },
    {
      id: 't2',
      title: 'حرف دلم',
      date: '1405/05/28',
      body: 'لواشکمم خواستم با این یه چیزز کوچیک و ناچیز بهت بگم خیلی دوست دارم و همیشه هم به یادتم خوشگلم😁💚\n\nنگران نباش بعدن قابلیتی هم میزارم توهم بهم به صورت خصوصی چیزی بگی یا بفرستی که فعلا آپلود عکس هستش'
    },
    {
      id: 't3',
      title: 'ببخشید آیداجونمم',
      date: '1405/06/01',
      body: 'اامم میدونم الان ازم ناراحتی آیدا وقتی به قران اون طوری که فکر میکنی نیست من همیشه تو رو به خاطر تمام وجودت دوست داشتم ودارمم وهمین طوریم هست همیشه و لطفا ازم ناراحت نباش من خب حرف میزدیم یعنی به خاطر اون چیز شد و به خدا همین به خدا قسم همین به جون تو و وگرنه من نمیشنم که هردقیقه اینطوری فکر بکنم یا بگم فلان فلان یعنی به خدا قسم بحثی نمیشید اینطوری تو وسط منم چیز نمیشد به خدا:('
    }
  ];

  function getVideos() { return videos; }
  function getPhotos() { return photos; }
  function getVoices() { return voices; }
  function getTexts() { return texts; }

  function getCounts() {
    return {
      videos: videos.length,
      photos: photos.length,
      voices: voices.length,
      texts: texts.length
    };
  }

  return {
    getVideos,
    getPhotos,
    getVoices,
    getTexts,
    getCounts
  };
})();
