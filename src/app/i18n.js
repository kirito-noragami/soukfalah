export const LOCALE_STORAGE_KEY = 'soukfalah-locale';
export const SUPPORTED_LOCALES = ['ar', 'fr', 'en'];
export const DEFAULT_LOCALE = 'en';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT']);
const TRANSLATABLE_ATTRS = ['placeholder', 'aria-label', 'title'];

const EXACT_TRANSLATIONS = {
  ar: {
    Home: 'الرئيسية',
    Marketplace: 'السوق',
    Cart: 'السلة',
    'About Us': 'من نحن',
    Contact: 'اتصل بنا',
    Dashboard: 'لوحة التحكم',
    'Log In': 'تسجيل الدخول',
    'Sign Up': 'إنشاء حساب',
    'Log Out': 'تسجيل الخروج',
    Light: 'فاتح',
    Dark: 'داكن',
    'Primary navigation': 'التنقل الرئيسي',
    'Footer navigation': 'تنقل التذييل',
    'Language selector': 'اختيار اللغة',
    'Switch to light mode': 'التبديل إلى الوضع الفاتح',
    'Switch to dark mode': 'التبديل إلى الوضع الداكن',
    'Create an Account': 'إنشاء حساب',
    'Join the SoukFellah community': 'انضم إلى مجتمع سوق الفلاح',
    'Already have an account?': 'لديك حساب بالفعل؟',
    Register: 'تسجيل',
    'Please select a role to continue.': 'يرجى اختيار دور للمتابعة.',
    'Create a password': 'أنشئ كلمة مرور',
    'Full name': 'الاسم الكامل',
    Email: 'البريد الإلكتروني',
    Password: 'كلمة المرور',
    Role: 'الدور',
    Farmer: 'فلاح',
    Buyer: 'مشتري',
    Admin: 'مشرف',
    'Buyer Mode': 'وضع المشتري',
    'Farmer Mode': 'وضع الفلاح',
    'Admin Mode': 'وضع المشرف',
    'Guest Mode': 'وضع الزائر',
    'Browse Marketplace': 'تصفح السوق',
    'Become a Farmer Seller': 'كن بائعًا فلاحًا',
    'Open Buyer Workspace': 'افتح مساحة المشتري',
    'Open Farmer Studio': 'افتح استوديو الفلاح',
    'Open Admin Operations': 'افتح عمليات المشرف',
    'Manage Orders': 'إدارة الطلبات',
    'Review Products': 'مراجعة المنتجات',
    'Start Shopping': 'ابدأ التسوق',
    'Shopping Cart': 'سلة التسوق',
    'Review your items before checkout.': 'راجع منتجاتك قبل الدفع.',
    Search: 'بحث',
    Checkout: 'الدفع',
    'Buy Fresh Products': 'اشترِ منتجات طازجة',
    'Directly from Farmers': 'مباشرة من الفلاحين',
    'Buy Fresh Products Directly from Farmers': 'اشترِ منتجات طازجة مباشرة من الفلاحين',
    'Connect directly with local farmers, get the freshest produce at fair prices.': 'تواصل مباشرة مع الفلاحين المحليين واحصل على منتجات طازجة بأسعار عادلة.',
    'Continue Shopping': 'تابع التسوق',
    'From Trusted Farmers': 'من فلاحين موثوقين',
    'Manage Your Farm': 'أدر مزرعتك',
    'Sell with Confidence': 'بع بثقة',
    'Operate the Platform': 'أدر المنصة',
    'Review and Scale': 'راجع ووسّع',
    'Ready to get fresh,': 'هل أنت مستعد للحصول على منتجات طازجة،',
    'local products from farmers?': 'ومحلية من الفلاحين؟',
    'Ready for your next': 'هل أنت مستعد لطلبك القادم',
    'farm order?': 'من المزرعة؟',
    'Ready to publish': 'هل أنت مستعد لنشر',
    'today harvest?': 'حصاد اليوم؟',
    'Ready to review': 'هل أنت مستعد لمراجعة',
    'market activity?': 'نشاط السوق؟',
    '(c) 2024 SoukFellah. All rights reserved.': '(c) 2024 SoukFellah. جميع الحقوق محفوظة.',
    'Buyer Workspace': 'مساحة المشتري',
    'Farmer Studio': 'استوديو الفلاح',
    'Admin Operations': 'عمليات المشرف',
    'Seller Onboarding': 'انضمام البائع',
    Orders: 'الطلبات',
    Order: 'طلب',
    Favorites: 'المفضلة',
    'Favorite Farms': 'المزارع المفضلة',
    Addresses: 'العناوين',
    Support: 'الدعم',
    'New Draft Order': 'طلب مسودة جديد',
    Pending: 'قيد الانتظار',
    Processing: 'قيد المعالجة',
    'In Transit': 'في الطريق',
    Delivered: 'تم التسليم',
    Cancelled: 'ملغي',
    Open: 'مفتوح',
    Resolved: 'تم الحل',
    'Open Ticket': 'فتح تذكرة',
    Resolve: 'حل',
    Reopen: 'إعادة فتح',
    'Add Favorite': 'إضافة للمفضلة',
    Browse: 'تصفح',
    Remove: 'إزالة',
    'Add Address': 'إضافة عنوان',
    'Set Default': 'اجعل افتراضيًا',
    Default: 'افتراضي',
    'Product Catalog': 'كتالوج المنتجات',
    Listings: 'المنتجات المعروضة',
    Listing: 'منتج معروض',
    'Add Listing': 'إضافة منتج',
    'Request Payout': 'طلب دفعة',
    'Payout Center': 'مركز الدفعات',
    'Create Payout Request': 'إنشاء طلب دفعة',
    'Mark Paid': 'تحديد كمدفوع',
    'Harvest Calendar': 'تقويم الحصاد',
    'Add Task': 'إضافة مهمة',
    'Mark Done': 'تحديد كمكتمل',
    Rejected: 'مرفوض',
    Paused: 'متوقف',
    Live: 'نشط',
    'Restock +25': 'إعادة تخزين +25',
    Pause: 'إيقاف',
    Resume: 'استئناف',
    'Farmer Orders': 'طلبات الفلاح',
    Advance: 'تقدّم',
    Reject: 'رفض',
    'Product Moderation Queue': 'طابور مراجعة المنتجات',
    Approve: 'قبول',
    Changes: 'تعديلات',
    'Seller Applications': 'طلبات انضمام البائعين',
    'Need Docs': 'بحاجة لوثائق',
    'Disputes Desk': 'مكتب النزاعات',
    Investigate: 'تحقيق',
    Refund: 'استرداد',
    'Finance & Risk Settings': 'إعدادات المالية والمخاطر',
    'Commission rate (%)': 'نسبة العمولة (%)',
    'Payout day': 'يوم الدفعات',
    'Escrow mode': 'وضع الضمان',
    'Auto risk hold': 'إيقاف مخاطر تلقائي',
    Save: 'حفظ',
    'Save Settings': 'حفظ الإعدادات',
    'Audit Trail': 'سجل التدقيق',
    'Farmer Seller Checklist': 'قائمة تحقق بائع فلاح',
    'Seller Application Form': 'نموذج طلب البائع',
    'Submit Seller Application': 'إرسال طلب البائع',
    'Register as Farmer': 'سجل كفلاح',
    Login: 'تسجيل الدخول',
    'Open Admin Page': 'افتح صفحة المشرف',
    'Required Pages for a Great Farm Marketplace': 'الصفحات المطلوبة لسوق فلاحي ممتاز',
    'Buyer role': 'دور المشتري',
    'Farmer role': 'دور الفلاح',
    'Admin role': 'دور المشرف',
    'Empowering Moroccan farmers and promoting sustainable agriculture with fair, transparent markets.': 'نمكّن الفلاحين المغاربة وندعم الفلاحة المستدامة عبر أسواق عادلة وشفافة.',
    'We help local farmers reach nearby buyers with fair prices, reliable payments, and clear logistics. SoukFellah champions sustainable practices so every harvest protects the soil and supports rural families.': 'نساعد الفلاحين المحليين على الوصول إلى المشترين القريبين بأسعار عادلة، ودفعات موثوقة، ولوجستيات واضحة. يدعم SoukFellah الممارسات المستدامة حتى يحمي كل حصاد التربة ويدعم العائلات القروية.',
    'A connected rural economy where farmers are valued, harvests travel fewer kilometers, and families enjoy fresh produce with full traceability.': 'اقتصاد قروي مترابط يُقدَّر فيه الفلاحون، وتقطع فيه المحاصيل مسافات أقل، وتستمتع فيه العائلات بمنتجات طازجة مع تتبع كامل.',
    'Encourage eco friendly farming practices that protect water and soil.': 'نشجع الممارسات الفلاحية الصديقة للبيئة التي تحمي الماء والتربة.',
    'Support rural families with stable income and predictable demand.': 'ندعم العائلات القروية بدخل مستقر وطلب متوقع.',
    'Give buyers clarity while ensuring farmers earn fair compensation.': 'نوفر وضوحًا للمشترين مع ضمان حصول الفلاحين على تعويض عادل.',
    'Focused initiatives that keep farms thriving and food fresh.': 'مبادرات مركزة تُبقي المزارع مزدهرة والطعام طازجًا.',
    'Since our launch, SoukFellah has helped growers reach customers across Morocco. Here are a few highlights from the community.': 'منذ انطلاقنا، ساعد SoukFellah المزارعين على الوصول إلى الزبائن عبر المغرب. إليك بعض أبرز إنجازات المجتمع.',
    'Support local farms by buying their fresh, organic produce.': 'ادعم المزارع المحلية بشراء منتجاتها الطازجة والعضوية.',
    'Get the best prices and the freshest products directly from the farm.': 'احصل على أفضل الأسعار وأطزج المنتجات مباشرة من المزرعة.',
    'Easy and safe payment methods for a secure shopping experience.': 'طرق دفع سهلة وآمنة لتجربة تسوق آمنة.',
    'Connect directly with local farmers, get the freshest produce at fair prices.': 'تواصل مباشرة مع الفلاحين المحليين واحصل على منتجات طازجة جدًا بأسعار عادلة.',
    'Ready to get fresh, local products from farmers?': 'هل أنت مستعد للحصول على منتجات طازجة ومحلية من الفلاحين؟',
    'By placing this order, you agree to the Terms of Service and Privacy Policy.': 'بتأكيد هذا الطلب، فإنك توافق على شروط الخدمة وسياسة الخصوصية.'
  },
  fr: {
    Home: 'Accueil',
    Marketplace: 'Marché',
    Cart: 'Panier',
    'About Us': 'À propos',
    Contact: 'Contact',
    Dashboard: 'Tableau de bord',
    'Log In': 'Connexion',
    'Sign Up': "S'inscrire",
    'Log Out': 'Déconnexion',
    Light: 'Clair',
    Dark: 'Sombre',
    'Primary navigation': 'Navigation principale',
    'Footer navigation': 'Navigation du pied de page',
    'Language selector': 'Sélecteur de langue',
    'Switch to light mode': 'Passer en mode clair',
    'Switch to dark mode': 'Passer en mode sombre',
    'Create an Account': 'Créer un compte',
    'Join the SoukFellah community': 'Rejoignez la communauté SoukFellah',
    'Already have an account?': 'Vous avez déjà un compte ?',
    Register: "S'inscrire",
    'Please select a role to continue.': 'Veuillez sélectionner un rôle pour continuer.',
    'Create a password': 'Créer un mot de passe',
    'Full name': 'Nom complet',
    Email: 'E-mail',
    Password: 'Mot de passe',
    Role: 'Rôle',
    Farmer: 'Agriculteur',
    Buyer: 'Acheteur',
    Admin: 'Admin',
    'Buyer Mode': 'Mode Acheteur',
    'Farmer Mode': 'Mode Agriculteur',
    'Admin Mode': 'Mode Admin',
    'Guest Mode': 'Mode Invité',
    'Browse Marketplace': 'Parcourir le marché',
    'Become a Farmer Seller': 'Devenir vendeur agriculteur',
    'Open Buyer Workspace': "Ouvrir l'espace acheteur",
    'Open Farmer Studio': "Ouvrir le studio agriculteur",
    'Open Admin Operations': 'Ouvrir les opérations admin',
    'Manage Orders': 'Gérer les commandes',
    'Review Products': 'Vérifier les produits',
    'Start Shopping': 'Commencer les achats',
    'Shopping Cart': 'Panier',
    'Review your items before checkout.': 'Vérifiez vos articles avant le paiement.',
    Search: 'Rechercher',
    Checkout: 'Paiement',
    'Buy Fresh Products': 'Achetez des produits frais',
    'Directly from Farmers': 'Directement auprès des agriculteurs',
    'Connect directly with local farmers, get the freshest produce at fair prices.': 'Connectez-vous directement aux agriculteurs locaux et obtenez les produits les plus frais à prix juste.',
    'Continue Shopping': 'Continuer vos achats',
    'From Trusted Farmers': 'Chez des agriculteurs de confiance',
    'Manage Your Farm': 'Gérez votre ferme',
    'Sell with Confidence': 'Vendez en toute confiance',
    'Operate the Platform': 'Pilotez la plateforme',
    'Review and Scale': 'Contrôlez et développez',
    'Ready to get fresh,': 'Prêt à obtenir des produits',
    'local products from farmers?': 'locaux et frais des agriculteurs ?',
    'Ready for your next': 'Prêt pour votre prochaine',
    'farm order?': 'commande agricole ?',
    'Ready to publish': 'Prêt à publier',
    'today harvest?': "la récolte d'aujourd'hui ?",
    'Ready to review': 'Prêt à analyser',
    'market activity?': 'l’activité du marché ?',
    '(c) 2024 SoukFellah. All rights reserved.': '(c) 2024 SoukFellah. Tous droits réservés.',
    'Buyer Workspace': 'Espace acheteur',
    'Farmer Studio': 'Studio agriculteur',
    'Admin Operations': 'Opérations admin',
    'Seller Onboarding': 'Intégration vendeur',
    Orders: 'Commandes',
    Order: 'Commande',
    Favorites: 'Favoris',
    'Favorite Farms': 'Fermes favorites',
    Addresses: 'Adresses',
    Support: 'Support',
    'New Draft Order': 'Nouvelle commande brouillon',
    Pending: 'En attente',
    Processing: 'En traitement',
    'In Transit': 'En transit',
    Delivered: 'Livré',
    Cancelled: 'Annulé',
    Open: 'Ouvert',
    Resolved: 'Résolu',
    'Open Ticket': 'Ouvrir un ticket',
    Resolve: 'Résoudre',
    Reopen: 'Rouvrir',
    'Add Favorite': 'Ajouter aux favoris',
    Browse: 'Parcourir',
    Remove: 'Supprimer',
    'Add Address': 'Ajouter une adresse',
    'Set Default': 'Définir par défaut',
    Default: 'Par défaut',
    'Product Catalog': 'Catalogue produits',
    Listings: 'Annonces',
    Listing: 'Annonce',
    'Add Listing': 'Ajouter un produit',
    'Request Payout': 'Demander un paiement',
    'Payout Center': 'Centre de paiements',
    'Create Payout Request': 'Créer une demande de paiement',
    'Mark Paid': 'Marquer payé',
    'Harvest Calendar': 'Calendrier de récolte',
    'Add Task': 'Ajouter une tâche',
    'Mark Done': 'Marquer terminé',
    Rejected: 'Rejeté',
    Paused: 'En pause',
    Live: 'Actif',
    'Restock +25': 'Réappro +25',
    Pause: 'Pause',
    Resume: 'Reprendre',
    'Farmer Orders': 'Commandes agriculteur',
    Advance: 'Avancer',
    Reject: 'Rejeter',
    'Product Moderation Queue': 'File de modération produits',
    Approve: 'Approuver',
    Changes: 'Modifs',
    'Seller Applications': 'Candidatures vendeurs',
    'Need Docs': 'Docs requis',
    'Disputes Desk': 'Bureau des litiges',
    Investigate: 'Enquêter',
    Refund: 'Rembourser',
    'Finance & Risk Settings': 'Paramètres finance & risque',
    'Commission rate (%)': 'Taux de commission (%)',
    'Payout day': 'Jour de paiement',
    'Escrow mode': 'Mode séquestre',
    'Auto risk hold': 'Blocage risque auto',
    Save: 'Enregistrer',
    'Save Settings': 'Enregistrer les paramètres',
    'Audit Trail': "Journal d'audit",
    'Farmer Seller Checklist': 'Checklist vendeur agriculteur',
    'Seller Application Form': 'Formulaire de candidature vendeur',
    'Submit Seller Application': 'Soumettre la candidature vendeur',
    'Register as Farmer': "S'inscrire comme agriculteur",
    Login: 'Connexion',
    'Open Admin Page': "Ouvrir la page admin",
    'Required Pages for a Great Farm Marketplace': "Pages nécessaires pour un excellent marché agricole",
    'Buyer role': 'Rôle acheteur',
    'Farmer role': 'Rôle agriculteur',
    'Admin role': 'Rôle admin',
    'Empowering Moroccan farmers and promoting sustainable agriculture with fair, transparent markets.': 'Nous donnons aux agriculteurs marocains les moyens de réussir et promouvons une agriculture durable grâce à des marchés équitables et transparents.',
    'We help local farmers reach nearby buyers with fair prices, reliable payments, and clear logistics. SoukFellah champions sustainable practices so every harvest protects the soil and supports rural families.': 'Nous aidons les agriculteurs locaux à atteindre des acheteurs proches grâce à des prix équitables, des paiements fiables et une logistique claire. SoukFellah soutient des pratiques durables afin que chaque récolte protège le sol et soutienne les familles rurales.',
    'A connected rural economy where farmers are valued, harvests travel fewer kilometers, and families enjoy fresh produce with full traceability.': 'Une économie rurale connectée où les agriculteurs sont valorisés, où les récoltes parcourent moins de kilomètres et où les familles profitent de produits frais avec une traçabilité complète.',
    'Encourage eco friendly farming practices that protect water and soil.': 'Encourager des pratiques agricoles écoresponsables qui protègent l’eau et le sol.',
    'Support rural families with stable income and predictable demand.': 'Soutenir les familles rurales avec un revenu stable et une demande prévisible.',
    'Give buyers clarity while ensuring farmers earn fair compensation.': 'Offrir de la clarté aux acheteurs tout en garantissant une rémunération équitable aux agriculteurs.',
    'Focused initiatives that keep farms thriving and food fresh.': 'Des initiatives ciblées qui gardent les fermes prospères et les aliments frais.',
    'Since our launch, SoukFellah has helped growers reach customers across Morocco. Here are a few highlights from the community.': 'Depuis notre lancement, SoukFellah aide les producteurs à atteindre des clients dans tout le Maroc. Voici quelques points forts de la communauté.',
    'Support local farms by buying their fresh, organic produce.': 'Soutenez les fermes locales en achetant leurs produits frais et biologiques.',
    'Get the best prices and the freshest products directly from the farm.': 'Obtenez les meilleurs prix et les produits les plus frais directement de la ferme.',
    'Easy and safe payment methods for a secure shopping experience.': 'Des moyens de paiement simples et sûrs pour une expérience d’achat sécurisée.',
    'Connect directly with local farmers, get the freshest produce at fair prices.': 'Connectez-vous directement aux agriculteurs locaux et obtenez les produits les plus frais à des prix équitables.',
    'Ready to get fresh, local products from farmers?': 'Prêt à obtenir des produits frais et locaux auprès des agriculteurs ?',
    'By placing this order, you agree to the Terms of Service and Privacy Policy.': 'En passant cette commande, vous acceptez les Conditions de service et la Politique de confidentialité.'
  }
};

const FRAGMENT_TRANSLATIONS = {
  ar: {
    'Welcome back,': 'مرحبًا بعودتك،',
    Welcome: 'مرحبًا',
    'Manage your orders': 'أدر طلباتك',
    'favorite farms': 'المزارع المفضلة',
    'create new purchases': 'أنشئ مشتريات جديدة',
    'Order Workspace': 'مساحة الطلبات',
    'View All': 'عرض الكل',
    'Manage': 'إدارة',
    'All statuses': 'كل الحالات',
    'All cities': 'كل المدن',
    'Add a farm...': 'أضف مزرعة...',
    Add: 'إضافة',
    Product: 'منتج',
    Farm: 'مزرعة',
    Status: 'الحالة',
    Total: 'الإجمالي',
    Quantity: 'الكمية',
    Price: 'السعر',
    City: 'المدينة',
    Distance: 'المسافة',
    'Product Category': 'فئة المنتج',
    'Recent orders': 'الطلبات الأخيرة',
    'Open Map': 'افتح الخريطة',
    'My Orders': 'طلباتي',
    'Continue Shopping': 'تابع التسوق',
    'Open Buyer Workspace': 'افتح مساحة المشتري',
    'Open Farmer Studio': 'افتح استوديو الفلاح',
    'Open Admin Operations': 'افتح عمليات المشرف',
    'Marketplace filter': 'فلتر السوق',
    'Apply Filters': 'تطبيق الفلاتر',
    'Reset Filters': 'إعادة ضبط الفلاتر',
    'Product Details': 'تفاصيل المنتج',
    Description: 'الوصف',
    'Add to Cart': 'أضف إلى السلة',
    'Order Success': 'نجاح الطلب',
    'Contact Form': 'نموذج الاتصال',
    Message: 'رسالة',
    Submit: 'إرسال',
    Save: 'حفظ',
    Loading: 'جارٍ التحميل',
    'coming below': 'سيظهر أدناه',
    'Loading farmer tools...': 'جارٍ تحميل أدوات الفلاح...',
    'Loading admin tools...': 'جارٍ تحميل أدوات المشرف...',
    'Loading onboarding flow...': 'جارٍ تحميل مسار الانضمام...',
    'No activity yet.': 'لا يوجد نشاط بعد.',
    'No orders match your search.': 'لا توجد طلبات تطابق البحث.',
    'No favorite farms yet.': 'لا توجد مزارع مفضلة بعد.',
    'Current role': 'الدور الحالي',
    'Application status': 'حالة الطلب',
    'Next page': 'الصفحة التالية',
    'Checklist progress': 'تقدم القائمة',
    'Preparation steps completed': 'خطوات التحضير المكتملة',
    'Signed in as': 'مسجل الدخول باسم',
    'Guest visitor': 'زائر',
    'Awaiting admin review': 'بانتظار مراجعة المشرف',
    Draft: 'مسودة',
    Studio: 'الاستوديو',
    Register: 'تسجيل',
    'Open Admin Page': 'افتح صفحة المشرف',
    Monday: 'الاثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة'
  },
  fr: {
    'Welcome back,': 'Bon retour,',
    Welcome: 'Bienvenue',
    'Manage your orders': 'Gérez vos commandes',
    'favorite farms': 'fermes favorites',
    'create new purchases': 'créez de nouveaux achats',
    'Order Workspace': 'Espace commandes',
    'View All': 'Voir tout',
    Manage: 'Gérer',
    'All statuses': 'Tous les statuts',
    'All cities': 'Toutes les villes',
    'Add a farm...': 'Ajouter une ferme...',
    Add: 'Ajouter',
    Product: 'Produit',
    Farm: 'Ferme',
    Status: 'Statut',
    Total: 'Total',
    Quantity: 'Quantité',
    Price: 'Prix',
    City: 'Ville',
    Distance: 'Distance',
    'Product Category': 'Catégorie produit',
    'Recent orders': 'Commandes récentes',
    'Open Map': 'Ouvrir la carte',
    'My Orders': 'Mes commandes',
    'Continue Shopping': 'Continuer les achats',
    'Open Buyer Workspace': "Ouvrir l'espace acheteur",
    'Open Farmer Studio': 'Ouvrir le studio agriculteur',
    'Open Admin Operations': 'Ouvrir les opérations admin',
    'Marketplace filter': 'Filtre du marché',
    'Apply Filters': 'Appliquer les filtres',
    'Reset Filters': 'Réinitialiser les filtres',
    'Product Details': 'Détails du produit',
    Description: 'Description',
    'Add to Cart': 'Ajouter au panier',
    'Order Success': 'Commande réussie',
    'Contact Form': 'Formulaire de contact',
    Message: 'Message',
    Submit: 'Soumettre',
    Save: 'Enregistrer',
    Loading: 'Chargement',
    'No activity yet.': 'Aucune activité pour le moment.',
    'Current role': 'Rôle actuel',
    'Application status': 'Statut de la candidature',
    'Next page': 'Page suivante',
    'Checklist progress': 'Progression de la checklist',
    'Preparation steps completed': 'Étapes de préparation terminées',
    'Signed in as': 'Connecté en tant que',
    'Guest visitor': 'Visiteur',
    Draft: 'Brouillon',
    Studio: 'Studio',
    Register: "S'inscrire",
    Monday: 'Lundi',
    Tuesday: 'Mardi',
    Wednesday: 'Mercredi',
    Thursday: 'Jeudi',
    Friday: 'Vendredi'
  }
};

const DYNAMIC_PATTERNS = {
  ar: [{
    test: /^Welcome,\s+(.+)$/i,
    replace: (_match, name) => `مرحبًا، ${name}`
  }, {
    test: /^Welcome back,\s+(.+)!$/i,
    replace: (_match, name) => `مرحبًا بعودتك، ${name}!`
  }, {
    test: /^(\d+)\s+orders$/i,
    replace: (_match, count) => `${count} طلبات`
  }, {
    test: /^(\d+)\s+favorites$/i,
    replace: (_match, count) => `${count} مفضلة`
  }, {
    test: /^ETA:\s*(.+)$/i,
    replace: (_match, value) => `وقت الوصول: ${value}`
  }],
  fr: [{
    test: /^Welcome,\s+(.+)$/i,
    replace: (_match, name) => `Bienvenue, ${name}`
  }, {
    test: /^Welcome back,\s+(.+)!$/i,
    replace: (_match, name) => `Bon retour, ${name} !`
  }, {
    test: /^(\d+)\s+orders$/i,
    replace: (_match, count) => `${count} commandes`
  }, {
    test: /^(\d+)\s+favorites$/i,
    replace: (_match, count) => `${count} favoris`
  }, {
    test: /^ETA:\s*(.+)$/i,
    replace: (_match, value) => `ETA : ${value}`
  }]
};

const WORD_TRANSLATIONS = {
  ar: {
    home: 'الرئيسية',
    marketplace: 'السوق',
    market: 'السوق',
    cart: 'السلة',
    checkout: 'الدفع',
    about: 'حول',
    contact: 'اتصال',
    dashboard: 'لوحة',
    dashboards: 'لوحات',
    user: 'مستخدم',
    users: 'المستخدمون',
    admin: 'مشرف',
    administrator: 'مشرف',
    buyer: 'مشتري',
    buyers: 'المشترون',
    farmer: 'فلاح',
    farmers: 'الفلاحون',
    seller: 'بائع',
    sellers: 'البائعون',
    product: 'منتج',
    products: 'منتجات',
    listing: 'عرض',
    listings: 'العروض',
    item: 'عنصر',
    items: 'عناصر',
    category: 'فئة',
    categories: 'فئات',
    city: 'مدينة',
    cities: 'مدن',
    region: 'منطقة',
    regions: 'مناطق',
    farm: 'مزرعة',
    farms: 'مزارع',
    profile: 'ملف',
    local: 'محلي',
    nearby: 'قريب',
    map: 'خريطة',
    view: 'عرض',
    search: 'بحث',
    quick: 'سريع',
    filter: 'فلتر',
    filters: 'فلاتر',
    all: 'كل',
    distance: 'مسافة',
    price: 'سعر',
    prices: 'أسعار',
    pricing: 'تسعير',
    range: 'نطاق',
    quantity: 'كمية',
    qty: 'كمية',
    total: 'إجمالي',
    subtotal: 'إجمالي فرعي',
    order: 'طلب',
    orders: 'طلبات',
    ordering: 'الطلب',
    recent: 'أخيرة',
    history: 'سجل',
    status: 'حالة',
    statuses: 'حالات',
    pending: 'معلق',
    processing: 'معالجة',
    preparing: 'تحضير',
    accepted: 'مقبول',
    approved: 'معتمد',
    rejected: 'مرفوض',
    declined: 'مرفوض',
    cancelled: 'ملغي',
    delivered: 'مسلّم',
    shipping: 'شحن',
    shipped: 'مشحون',
    transit: 'طريق',
    negotiating: 'تفاوض',
    submitted: 'مرسل',
    review: 'مراجعة',
    reviews: 'مراجعات',
    moderation: 'مراجعة',
    queue: 'طابور',
    changes: 'تعديلات',
    requested: 'مطلوبة',
    request: 'طلب',
    requests: 'طلبات',
    incoming: 'واردة',
    open: 'فتح',
    close: 'إغلاق',
    closed: 'مغلق',
    reopen: 'إعادة-فتح',
    resolve: 'حل',
    resolved: 'تم-الحل',
    dispute: 'نزاع',
    disputes: 'نزاعات',
    desk: 'مكتب',
    support: 'دعم',
    ticket: 'تذكرة',
    tickets: 'تذاكر',
    subject: 'موضوع',
    message: 'رسالة',
    note: 'ملاحظة',
    notes: 'ملاحظات',
    create: 'إنشاء',
    new: 'جديد',
    draft: 'مسودة',
    add: 'إضافة',
    remove: 'إزالة',
    delete: 'حذف',
    save: 'حفظ',
    submit: 'إرسال',
    update: 'تحديث',
    manage: 'إدارة',
    management: 'إدارة',
    browse: 'تصفح',
    open: 'افتح',
    continue: 'تابع',
    start: 'ابدأ',
    become: 'كن',
    track: 'تتبّع',
    tracked: 'متتبعة',
    favorite: 'مفضلة',
    favorites: 'مفضلات',
    spend: 'إنفاق',
    monthly: 'شهري',
    workspace: 'مساحة',
    workspaces: 'مساحات',
    activity: 'نشاط',
    active: 'نشط',
    inactive: 'غير-نشط',
    available: 'متاح',
    availability: 'التوفر',
    estimated: 'مقدر',
    revenue: 'إيراد',
    fee: 'رسوم',
    fees: 'رسوم',
    projected: 'متوقع',
    report: 'تقرير',
    full: 'كامل',
    threshold: 'حد',
    thresholds: 'حدود',
    actions: 'إجراءات',
    action: 'إجراء',
    settings: 'إعدادات',
    setting: 'إعداد',
    language: 'لغة',
    languages: 'لغات',
    navigation: 'تنقل',
    primary: 'رئيسي',
    footer: 'تذييل',
    menu: 'قائمة',
    light: 'فاتح',
    dark: 'داكن',
    mode: 'وضع',
    switch: 'تبديل',
    role: 'دور',
    current: 'حالي',
    guest: 'زائر',
    login: 'دخول',
    log: 'سجل',
    sign: 'إنشاء',
    register: 'تسجيل',
    account: 'حساب',
    accounts: 'حسابات',
    name: 'اسم',
    full: 'كامل',
    email: 'بريد',
    address: 'عنوان',
    addresses: 'عناوين',
    phone: 'هاتف',
    number: 'رقم',
    information: 'معلومات',
    description: 'وصف',
    details: 'تفاصيل',
    gallery: 'معرض',
    save: 'حفظ',
    item: 'عنصر',
    quantity: 'كمية',
    increase: 'زيادة',
    decrease: 'تقليل',
    selector: 'محدد',
    empty: 'فارغة',
    your: 'الخاص-بك',
    this: 'هذا',
    from: 'من',
    for: 'لـ',
    and: 'و',
    with: 'مع',
    or: 'أو',
    to: 'إلى',
    by: 'بواسطة',
    of: 'من',
    in: 'في',
    on: 'على',
    near: 'قرب',
    up: 'حتى',
    direct: 'مباشر',
    fair: 'عادل',
    fresh: 'طازج',
    secure: 'آمن',
    online: 'عبر-الإنترنت',
    payment: 'دفع',
    pickup: 'استلام',
    verified: 'موثق',
    story: 'قصة',
    mission: 'مهمة',
    vision: 'رؤية',
    goals: 'أهداف',
    goal: 'هدف',
    impact: 'أثر',
    partner: 'شريك',
    partners: 'شركاء',
    served: 'مخدومة',
    harvest: 'حصاد',
    sustainability: 'استدامة',
    sustainable: 'مستدام',
    communities: 'مجتمعات',
    community: 'مجتمع',
    transparent: 'شفاف',
    chain: 'سلسلة',
    supply: 'إمداد',
    first: 'أولاً',
    short: 'قصير',
    strength: 'قوة',
    strengthen: 'تعزيز',
    promote: 'تعزيز',
    receive: 'استلام',
    works: 'يعمل',
    how: 'كيف',
    section: 'قسم',
    form: 'نموذج',
    success: 'نجاح',
    terms: 'الشروط',
    service: 'الخدمة',
    privacy: 'الخصوصية',
    policy: 'السياسة',
    agreed: 'موافق',
    agree: 'توافق',
    placing: 'إجراء',
    please: 'يرجى',
    select: 'اختر',
    continue: 'تابع',
    invalid: 'غير-صحيح',
    credentials: 'بيانات-الدخول',
    try: 'جرّب',
    loading: 'تحميل',
    no: 'لا',
    data: 'بيانات',
    appear: 'تظهر',
    after: 'بعد',
    first: 'أول',
    application: 'طلب',
    applications: 'طلبات',
    checklist: 'قائمة-تحقق',
    progress: 'تقدم',
    preparation: 'تحضير',
    steps: 'خطوات',
    completed: 'مكتملة',
    awaiting: 'بانتظار',
    next: 'التالي',
    page: 'صفحة',
    finance: 'مالية',
    risk: 'مخاطر',
    controls: 'ضوابط',
    control: 'ضبط',
    commission: 'عمولة',
    payout: 'دفعة',
    payouts: 'دفعات',
    escrow: 'ضمان',
    auto: 'تلقائي',
    hold: 'إيقاف',
    approve: 'اعتماد',
    reject: 'رفض',
    refunds: 'استردادات',
    refund: 'استرداد',
    investigate: 'تحقيق',
    audit: 'تدقيق',
    trail: 'سجل',
    operations: 'عمليات',
    operational: 'تشغيلي',
    tools: 'أدوات',
    studio: 'استوديو',
    onboarding: 'انضمام',
    planner: 'مخطط',
    calendar: 'تقويم',
    task: 'مهمة',
    tasks: 'مهام',
    done: 'مكتمل',
    pause: 'إيقاف',
    paused: 'موقوف',
    resume: 'استئناف',
    restock: 'إعادة-تخزين',
    stock: 'مخزون',
    inventory: 'مخزون',
    mix: 'مزيج',
    standard: 'عادي',
    express: 'سريع',
    packaging: 'تغليف',
    delivery: 'توصيل',
    offered: 'مقترح',
    projected: 'متوقع',
    throughput: 'الإنتاجية',
    validations: 'مراجعات',
    validation: 'مراجعة',
    trusted: 'موثوق',
    alerts: 'تنبيهات',
    alert: 'تنبيه',
    maintenance: 'صيانة',
    email: 'بريد',
    users: 'المستخدمون',
    filtered: 'مفلترة',
    pending: 'معلق',
    approved: 'معتمد',
    marrakesh: 'مراكش',
    marrakech: 'مراكش',
    rabat: 'الرباط',
    casablanca: 'الدار البيضاء',
    tangier: 'طنجة',
    meknes: 'مكناس',
    fes: 'فاس',
    agadir: 'أكادير',
    tetouan: 'تطوان',
    chefchaouen: 'شفشاون',
    oujda: 'وجدة',
    midelt: 'ميدلت',
    sefrou: 'صفرو'
  },
  fr: {
    home: 'accueil',
    marketplace: 'marché',
    market: 'marché',
    cart: 'panier',
    checkout: 'paiement',
    about: 'à propos',
    contact: 'contact',
    dashboard: 'tableau',
    dashboards: 'tableaux',
    user: 'utilisateur',
    users: 'utilisateurs',
    admin: 'admin',
    administrator: 'administrateur',
    buyer: 'acheteur',
    buyers: 'acheteurs',
    farmer: 'agriculteur',
    farmers: 'agriculteurs',
    seller: 'vendeur',
    sellers: 'vendeurs',
    product: 'produit',
    products: 'produits',
    listing: 'annonce',
    listings: 'annonces',
    item: 'article',
    items: 'articles',
    category: 'catégorie',
    categories: 'catégories',
    city: 'ville',
    cities: 'villes',
    region: 'région',
    regions: 'régions',
    farm: 'ferme',
    farms: 'fermes',
    profile: 'profil',
    local: 'local',
    nearby: 'proche',
    map: 'carte',
    view: 'vue',
    search: 'recherche',
    quick: 'rapide',
    filter: 'filtre',
    filters: 'filtres',
    all: 'tous',
    distance: 'distance',
    price: 'prix',
    prices: 'prix',
    pricing: 'tarification',
    range: 'plage',
    quantity: 'quantité',
    qty: 'qté',
    total: 'total',
    subtotal: 'sous-total',
    order: 'commande',
    orders: 'commandes',
    recent: 'récentes',
    history: 'historique',
    status: 'statut',
    statuses: 'statuts',
    pending: 'en attente',
    processing: 'en traitement',
    preparing: 'préparation',
    accepted: 'accepté',
    approved: 'approuvé',
    rejected: 'rejeté',
    declined: 'refusé',
    cancelled: 'annulé',
    delivered: 'livré',
    shipping: 'livraison',
    shipped: 'expédié',
    transit: 'transit',
    negotiating: 'négociation',
    submitted: 'soumis',
    review: 'revue',
    reviews: 'revues',
    moderation: 'modération',
    queue: 'file',
    changes: 'modifications',
    requested: 'demandées',
    request: 'demande',
    requests: 'demandes',
    incoming: 'entrantes',
    open: 'ouvrir',
    close: 'fermer',
    closed: 'fermé',
    reopen: 'rouvrir',
    resolve: 'résoudre',
    resolved: 'résolu',
    dispute: 'litige',
    disputes: 'litiges',
    desk: 'bureau',
    support: 'support',
    ticket: 'ticket',
    tickets: 'tickets',
    subject: 'sujet',
    message: 'message',
    note: 'note',
    notes: 'notes',
    create: 'créer',
    new: 'nouveau',
    draft: 'brouillon',
    add: 'ajouter',
    remove: 'supprimer',
    delete: 'supprimer',
    save: 'enregistrer',
    submit: 'soumettre',
    update: 'mettre à jour',
    manage: 'gérer',
    management: 'gestion',
    browse: 'parcourir',
    continue: 'continuer',
    start: 'commencer',
    become: 'devenir',
    track: 'suivre',
    tracked: 'suivies',
    favorite: 'favori',
    favorites: 'favoris',
    spend: 'dépense',
    monthly: 'mensuel',
    workspace: 'espace',
    activity: 'activité',
    active: 'actif',
    available: 'disponible',
    estimated: 'estimé',
    revenue: 'revenu',
    fee: 'frais',
    fees: 'frais',
    projected: 'projeté',
    report: 'rapport',
    full: 'complet',
    threshold: 'seuil',
    thresholds: 'seuils',
    actions: 'actions',
    action: 'action',
    settings: 'paramètres',
    setting: 'paramètre',
    language: 'langue',
    languages: 'langues',
    navigation: 'navigation',
    primary: 'principale',
    footer: 'pied',
    menu: 'menu',
    light: 'clair',
    dark: 'sombre',
    mode: 'mode',
    switch: 'basculer',
    role: 'rôle',
    current: 'actuel',
    guest: 'invité',
    login: 'connexion',
    log: 'journal',
    sign: 'inscrire',
    register: 'inscription',
    account: 'compte',
    accounts: 'comptes',
    name: 'nom',
    email: 'email',
    address: 'adresse',
    addresses: 'adresses',
    phone: 'téléphone',
    number: 'numéro',
    information: 'information',
    description: 'description',
    details: 'détails',
    gallery: 'galerie',
    increase: 'augmenter',
    decrease: 'réduire',
    selector: 'sélecteur',
    empty: 'vide',
    your: 'votre',
    this: 'ce',
    from: 'de',
    for: 'pour',
    and: 'et',
    with: 'avec',
    or: 'ou',
    to: 'à',
    by: 'par',
    of: 'de',
    in: 'dans',
    on: 'sur',
    near: 'près',
    up: 'jusqu’à',
    direct: 'direct',
    fair: 'justes',
    fresh: 'frais',
    secure: 'sécurisé',
    online: 'en ligne',
    payment: 'paiement',
    pickup: 'retrait',
    verified: 'vérifié',
    story: 'histoire',
    mission: 'mission',
    vision: 'vision',
    goals: 'objectifs',
    goal: 'objectif',
    impact: 'impact',
    partner: 'partenaire',
    partners: 'partenaires',
    served: 'desservies',
    harvest: 'récolte',
    sustainability: 'durabilité',
    sustainable: 'durable',
    communities: 'communautés',
    community: 'communauté',
    transparent: 'transparent',
    chain: 'chaîne',
    supply: 'approvisionnement',
    first: 'd’abord',
    short: 'courte',
    strengthen: 'renforcer',
    promote: 'promouvoir',
    receive: 'recevoir',
    works: 'fonctionne',
    how: 'comment',
    section: 'section',
    form: 'formulaire',
    success: 'succès',
    terms: 'conditions',
    service: 'service',
    privacy: 'confidentialité',
    policy: 'politique',
    agree: 'acceptez',
    placing: 'passant',
    please: 'veuillez',
    select: 'sélectionner',
    invalid: 'invalides',
    credentials: 'identifiants',
    try: 'essayez',
    loading: 'chargement',
    no: 'aucun',
    data: 'données',
    appear: 'apparaîtront',
    after: 'après',
    application: 'candidature',
    applications: 'candidatures',
    checklist: 'checklist',
    progress: 'progression',
    preparation: 'préparation',
    steps: 'étapes',
    completed: 'terminées',
    awaiting: 'en attente',
    next: 'suivante',
    page: 'page',
    finance: 'finance',
    risk: 'risque',
    controls: 'contrôles',
    control: 'contrôle',
    commission: 'commission',
    payout: 'paiement',
    payouts: 'paiements',
    escrow: 'séquestre',
    auto: 'auto',
    hold: 'blocage',
    approve: 'approuver',
    reject: 'rejeter',
    refund: 'rembourser',
    investigate: 'enquêter',
    audit: 'audit',
    trail: 'journal',
    operations: 'opérations',
    operational: 'opérationnel',
    tools: 'outils',
    studio: 'studio',
    onboarding: 'intégration',
    planner: 'planificateur',
    calendar: 'calendrier',
    task: 'tâche',
    tasks: 'tâches',
    done: 'terminé',
    pause: 'pause',
    paused: 'en pause',
    resume: 'reprendre',
    restock: 'réapprovisionner',
    stock: 'stock',
    inventory: 'inventaire',
    mix: 'mix',
    standard: 'standard',
    express: 'express',
    packaging: 'emballage',
    delivery: 'livraison',
    offered: 'proposé',
    throughput: 'débit',
    validations: 'validations',
    validation: 'validation',
    trusted: 'fiables',
    alerts: 'alertes',
    alert: 'alerte',
    maintenance: 'maintenance',
    filtered: 'filtrés',
    tetouan: 'Tétouan',
    chefchaouen: 'Chefchaouen'
  }
};

const TOKEN_WORD_REGEX = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g;

const WORD_TRANSLATION_OVERRIDES = {
  ar: {
    more: 'المزيد',
    ready: 'جاهز',
    today: 'اليوم',
    directly: 'مباشرة',
    egg: 'بيضة',
    eggs: 'بيض',
    organic: 'عضوي',
    crispy: 'مقرمش',
    sweet: 'حلو',
    ripe: 'ناضج',
    fresh: 'طازج',
    local: 'محلي',
    we: 'نحن',
    us: 'نحن',
    you: 'أنت',
    our: 'خاصتنا',
    their: 'خاصتهم',
    help: 'نساعد',
    reach: 'يصل',
    clear: 'واضح',
    reliable: 'موثوق',
    logistics: 'لوجستيات',
    champion: 'يدعم',
    champions: 'يدعم',
    practice: 'ممارسة',
    practices: 'ممارسات',
    so: 'لذلك',
    every: 'كل',
    protect: 'يحمي',
    protects: 'يحمي',
    soil: 'التربة',
    support: 'يدعم',
    supports: 'يدعم',
    rural: 'ريفية',
    family: 'عائلة',
    families: 'عائلات',
    keep: 'يحافظ',
    keeps: 'يحافظ',
    thriving: 'مزدهرة',
    food: 'الغذاء',
    focused: 'مركزة',
    initiatives: 'مبادرات',
    initiative: 'مبادرة',
    connected: 'مترابط',
    economy: 'اقتصاد',
    valued: 'مقدّرون',
    travel: 'ينتقل',
    fewer: 'أقل',
    kilometers: 'كيلومترات',
    kilometre: 'كيلومتر',
    kilometress: 'كيلومترات',
    enjoy: 'يستمتع',
    produce: 'منتجات',
    full: 'كامل',
    traceability: 'إمكانية التتبع',
    protects: 'يحمي',
    supports: 'يدعم',
    freshers: 'طازج',
    picked: 'مقطوف',
    pick: 'قطف',
    picks: 'قطف',
    view: 'عرض',
    close: 'إغلاق',
    show: 'عرض',
    shows: 'يعرض',
    choose: 'اختر',
    chooses: 'يختار',
    ready: 'جاهز',
    todays: 'اليوم',
    etc: 'إلخ',
    open: 'افتح'
  },
  fr: {
    more: 'plus',
    ready: 'prêt',
    today: "aujourd'hui",
    directly: 'directement',
    egg: 'œuf',
    eggs: 'œufs',
    organic: 'bio',
    crispy: 'croquant',
    sweet: 'sucré',
    ripe: 'mûr',
    fresh: 'frais',
    local: 'local',
    we: 'nous',
    us: 'nous',
    you: 'vous',
    our: 'nos',
    their: 'leurs',
    help: 'aidons',
    reach: 'atteindre',
    clear: 'claire',
    reliable: 'fiable',
    logistics: 'logistique',
    champion: 'soutient',
    champions: 'soutient',
    practice: 'pratique',
    practices: 'pratiques',
    so: 'donc',
    every: 'chaque',
    protect: 'protège',
    protects: 'protège',
    soil: 'sol',
    support: 'soutient',
    supports: 'soutient',
    rural: 'rurales',
    family: 'famille',
    families: 'familles',
    keep: 'garder',
    keeps: 'garde',
    thriving: 'prospères',
    food: 'alimentation',
    focused: 'ciblées',
    initiatives: 'initiatives',
    initiative: 'initiative',
    connected: 'connectée',
    economy: 'économie',
    valued: 'valorisés',
    travel: 'voyagent',
    fewer: 'moins',
    kilometers: 'kilomètres',
    kilometre: 'kilomètre',
    enjoy: 'profitent',
    produce: 'produits',
    traceability: 'traçabilité',
    picked: 'cueilli',
    pick: 'cueillir',
    picks: 'cueillettes',
    close: 'fermer',
    show: 'afficher',
    shows: 'affiche',
    choose: 'choisir',
    etc: 'etc'
  }
};

const textNodeOriginals = new WeakMap();
const attributeOriginals = new WeakMap();

const sortedFragmentEntries = Object.fromEntries(Object.entries(FRAGMENT_TRANSLATIONS).map(([locale, entries]) => [locale, Object.entries(entries).sort((a, b) => b[0].length - a[0].length)]));
const normalizeLookupText = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const normalizedExactEntries = Object.fromEntries(Object.entries(EXACT_TRANSLATIONS).map(([locale, entries]) => [locale, Object.fromEntries(Object.entries(entries).map(([key, val]) => [normalizeLookupText(key), val]))]));
const normalizedWordEntries = Object.fromEntries(Object.entries(WORD_TRANSLATIONS).map(([locale, entries]) => {
  const merged = {
    ...entries,
    ...(WORD_TRANSLATION_OVERRIDES[locale] || {})
  };
  return [locale, Object.fromEntries(Object.entries(merged).map(([key, value]) => [key.toLowerCase(), value]))];
}));

const isAllCapsWord = (value) => /^[A-Z]+$/.test(value);

const isTitleWord = (value) => /^[A-Z][a-z]+$/.test(value);

const applyWordCasing = (sourceWord, translatedWord) => {
  if (!translatedWord) {
    return translatedWord;
  }

  if (isAllCapsWord(sourceWord)) {
    return translatedWord.toUpperCase();
  }

  if (isTitleWord(sourceWord)) {
    return translatedWord.charAt(0).toUpperCase() + translatedWord.slice(1);
  }

  return translatedWord;
};

const getWordTranslation = (word, locale) => {
  const words = normalizedWordEntries[locale];
  if (!words) {
    return null;
  }

  const lower = word.toLowerCase();
  if (words[lower]) {
    return words[lower];
  }

  if (lower.endsWith('ies')) {
    const singularY = `${lower.slice(0, -3)}y`;
    if (words[singularY]) {
      return words[singularY];
    }
  }

  if (lower.endsWith('es')) {
    const singularEs = lower.slice(0, -2);
    if (words[singularEs]) {
      return words[singularEs];
    }
  }

  if (lower.endsWith('s')) {
    const singularS = lower.slice(0, -1);
    if (words[singularS]) {
      return words[singularS];
    }
  }

  return null;
};

const ARABIC_FALLBACK_MAP = {
  a: 'ا',
  b: 'ب',
  c: 'ك',
  d: 'د',
  e: 'ي',
  f: 'ف',
  g: 'ج',
  h: 'ه',
  i: 'ي',
  j: 'ج',
  k: 'ك',
  l: 'ل',
  m: 'م',
  n: 'ن',
  o: 'و',
  p: 'ب',
  q: 'ق',
  r: 'ر',
  s: 'س',
  t: 'ت',
  u: 'و',
  v: 'ف',
  w: 'و',
  x: 'كس',
  y: 'ي',
  z: 'ز'
};

const transliterateEnglishToArabic = (token) => {
  let output = '';
  for (const char of token) {
    const lower = char.toLowerCase();
    output += ARABIC_FALLBACK_MAP[lower] || char;
  }
  return output || token;
};

const translateWordsFallback = (text, locale) => text.replace(TOKEN_WORD_REGEX, (token) => {
  const translated = getWordTranslation(token, locale);
  if (!translated) {
    if (locale === 'ar') {
      return transliterateEnglishToArabic(token);
    }
    return token;
  }
  return applyWordCasing(token, translated);
});

const isAsciiLetter = (char) => /[A-Za-z]/.test(char);

const isSingleWordFragment = (value) => /^[A-Za-z]+(?:['’-][A-Za-z]+)?$/.test(value.trim());

const replaceFragmentWithBoundaries = (input, from, to) => {
  if (!from) {
    return input;
  }

  let output = '';
  let cursor = 0;
  let changed = false;
  const startsWithLetter = isAsciiLetter(from[0] || '');
  const endsWithLetter = isAsciiLetter(from[from.length - 1] || '');

  while (cursor < input.length) {
    const matchIndex = input.indexOf(from, cursor);
    if (matchIndex === -1) {
      output += input.slice(cursor);
      break;
    }

    const beforeChar = matchIndex > 0 ? input[matchIndex - 1] : '';
    const afterIndex = matchIndex + from.length;
    const afterChar = afterIndex < input.length ? input[afterIndex] : '';
    const beforeOk = !startsWithLetter || !isAsciiLetter(beforeChar);
    const afterOk = !endsWithLetter || !isAsciiLetter(afterChar);

    if (beforeOk && afterOk) {
      output += input.slice(cursor, matchIndex);
      output += to;
      cursor = afterIndex;
      changed = true;
      continue;
    }

    output += input.slice(cursor, matchIndex + from.length);
    cursor = matchIndex + from.length;
  }

  return changed ? output : input;
};

export const isValidLocale = (value) => SUPPORTED_LOCALES.includes(value);

export const getStoredLocale = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isValidLocale(value) ? value : null;
  } catch {
    return null;
  }
};

export const getInitialLocale = () => getStoredLocale() || DEFAULT_LOCALE;

export const persistLocale = (locale) => {
  if (typeof window === 'undefined' || !isValidLocale(locale)) {
    return;
  }

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage failures.
  }
};

export const applyLocale = (locale) => {
  if (typeof document === 'undefined' || !isValidLocale(locale)) {
    return;
  }

  const root = document.documentElement;
  root.setAttribute('lang', locale);
  root.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  root.setAttribute('data-locale', locale);
};

const shouldSkipElement = (element) => {
  if (!(element instanceof Element)) {
    return true;
  }

  if (element.closest('[data-i18n-skip]')) {
    return true;
  }

  if (SKIP_TAGS.has(element.tagName)) {
    return true;
  }

  return false;
};

const preserveWhitespace = (source, translatedCore) => {
  const leading = source.match(/^\s*/)?.[0] || '';
  const trailing = source.match(/\s*$/)?.[0] || '';
  const coreLength = source.length - leading.length - trailing.length;

  if (coreLength < 0) {
    return translatedCore;
  }

  return `${leading}${translatedCore}${trailing}`;
};

const translateString = (source, locale) => {
  if (locale === 'en' || !source) {
    return source;
  }

  const trimmed = source.trim();
  if (!trimmed) {
    return source;
  }

  const exact = EXACT_TRANSLATIONS[locale]?.[trimmed];
  if (exact) {
    return preserveWhitespace(source, exact);
  }

  const normalizedExact = normalizedExactEntries[locale]?.[normalizeLookupText(trimmed)];
  if (normalizedExact) {
    return preserveWhitespace(source, normalizedExact);
  }

  if (!/[A-Za-z]/.test(trimmed)) {
    return source;
  }

  let translated = trimmed;

  const patterns = DYNAMIC_PATTERNS[locale] || [];
  for (const pattern of patterns) {
    if (pattern.test.test(translated)) {
      translated = translated.replace(pattern.test, pattern.replace);
      return preserveWhitespace(source, translated);
    }
  }

  const fragments = sortedFragmentEntries[locale] || [];
  for (const [from, to] of fragments) {
    if (!translated.includes(from)) {
      continue;
    }

    if (isSingleWordFragment(from)) {
      continue;
    }

    translated = replaceFragmentWithBoundaries(translated, from, to);
  }

  if (/[A-Za-z]/.test(translated)) {
    translated = translateWordsFallback(translated, locale);
  }

  return preserveWhitespace(source, translated);
};

const translateTextNode = (textNode, locale) => {
  if (!(textNode instanceof Text)) {
    return;
  }

  const parent = textNode.parentElement;
  if (!parent || shouldSkipElement(parent)) {
    return;
  }

  const original = textNodeOriginals.has(textNode) ? textNodeOriginals.get(textNode) : textNode.nodeValue;
  if (!textNodeOriginals.has(textNode)) {
    textNodeOriginals.set(textNode, original);
  }

  const nextValue = translateString(original || '', locale);
  if (textNode.nodeValue !== nextValue) {
    textNode.nodeValue = nextValue;
  }
};

const getAttributeStore = (element) => {
  let store = attributeOriginals.get(element);
  if (!store) {
    store = new Map();
    attributeOriginals.set(element, store);
  }
  return store;
};

const translateElementAttributes = (element, locale, specificAttribute) => {
  if (!(element instanceof Element) || shouldSkipElement(element)) {
    return;
  }

  const attrs = specificAttribute ? [specificAttribute] : TRANSLATABLE_ATTRS;
  const store = getAttributeStore(element);

  for (const attr of attrs) {
    if (!TRANSLATABLE_ATTRS.includes(attr) || !element.hasAttribute(attr)) {
      continue;
    }

    const currentValue = element.getAttribute(attr) || '';
    const originalValue = store.has(attr) ? store.get(attr) : currentValue;

    if (!store.has(attr)) {
      store.set(attr, originalValue);
    }

    const nextValue = translateString(originalValue, locale);
    if (currentValue !== nextValue) {
      element.setAttribute(attr, nextValue);
    }
  }
};

const translateTree = (root, locale) => {
  if (!root) {
    return;
  }

  if (root instanceof Text) {
    translateTextNode(root, locale);
    return;
  }

  if (root instanceof Element) {
    translateElementAttributes(root, locale);
  }

  if (typeof document === 'undefined') {
    return;
  }

  if (root instanceof Element || root instanceof DocumentFragment || root instanceof Document) {
    const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let currentText = textWalker.nextNode();
    while (currentText) {
      translateTextNode(currentText, locale);
      currentText = textWalker.nextNode();
    }

    if (root instanceof Element || root instanceof DocumentFragment || root instanceof Document) {
      const elements = root instanceof Element ? [root, ...root.querySelectorAll('*')] : Array.from(root.querySelectorAll?.('*') || []);
      for (const element of elements) {
        translateElementAttributes(element, locale);
      }
    }
  }
};

export const createDomTranslator = (root) => {
  if (typeof MutationObserver === 'undefined' || !root) {
    return {
      setLocale() {},
      disconnect() {}
    };
  }

  let activeLocale = DEFAULT_LOCALE;
  let isApplying = false;

  const safelyApply = (callback) => {
    isApplying = true;
    try {
      callback();
    } finally {
      isApplying = false;
    }
  };

  const observer = new MutationObserver((mutations) => {
    if (isApplying) {
      return;
    }

    safelyApply(() => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          translateTextNode(mutation.target, activeLocale);
          continue;
        }

        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          translateElementAttributes(mutation.target, activeLocale, mutation.attributeName || undefined);
          continue;
        }

        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            translateTree(node, activeLocale);
          }
        }
      }
    });
  });

  observer.observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: TRANSLATABLE_ATTRS
  });

  return {
    setLocale(nextLocale) {
      activeLocale = isValidLocale(nextLocale) ? nextLocale : DEFAULT_LOCALE;
      safelyApply(() => {
        translateTree(root, activeLocale);
      });
    },
    disconnect() {
      observer.disconnect();
    }
  };
};
