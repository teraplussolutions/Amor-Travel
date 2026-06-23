// Staff panel translations (admin + CRM)
// Default language: Macedonian (mk)

export type StaffLang = "mk" | "en";

export const staffT = {
  // Nav labels
  nav: {
    dashboard:    { mk: "Почетна",       en: "Dashboard" },
    clients:      { mk: "Клиенти",       en: "Clients" },
    quotes:       { mk: "Понуди",        en: "Quotations" },
    sales:        { mk: "Продажби",      en: "Sales" },
    expenses:     { mk: "Трошоци",       en: "Expenses" },
    vouchers:     { mk: "Ваучери",       en: "Vouchers" },
    searchFlights:{ mk: "Пребарај летови", en: "Search flights" },
    adminPanel:   { mk: "Админ Панел",   en: "Admin Panel" },
  },
  // Shell
  shell: {
    agentTitle:   { mk: "Amor Travel Агент",  en: "Amor Travel Agent" },
    agentSub:     { mk: "CRM, понуди, продажби и дневни операции", en: "CRM, quotes, sales, and daily operations" },
    adminTitle:   { mk: "Amor Travel Админ",  en: "Amor Travel Admin" },
    adminSub:     { mk: "Содржина на веб-сајтот amortravel.net", en: "Website content for amortravel.net" },
    menu:         { mk: "Мени",          en: "Menu" },
    lang:         { mk: "МК",            en: "EN" },
  },
  // Admin panel tabs
  admin: {
    websiteContent: { mk: "Содржина",    en: "Website Content" },
    trips:          { mk: "Патувања",    en: "Trips" },
    settings:       { mk: "Поставки",   en: "Settings" },
    team:           { mk: "Тим",         en: "Team" },
    permissions:    { mk: "Дозволи",    en: "Permissions" },
    // Trips panel
    addTrip:        { mk: "Додај патување", en: "Add trip" },
    editTrip:       { mk: "Уреди патување", en: "Edit trip" },
    save:           { mk: "Зачувај",     en: "Save" },
    cancel:         { mk: "Откажи",      en: "Cancel" },
    delete:         { mk: "Избриши",     en: "Delete" },
    publish:        { mk: "Објави",      en: "Publish" },
    draft:          { mk: "Нацрт",       en: "Draft" },
    hidden:         { mk: "Скриено",     en: "Hidden" },
    search:         { mk: "Пребарај...", en: "Search..." },
    titleMk:        { mk: "Наслов (МК)", en: "Title (MK)" },
    titleEn:        { mk: "Наслов (EN)", en: "Title (EN)" },
    destination:    { mk: "Дестинација", en: "Destination" },
    departure:      { mk: "Поаѓање",    en: "Departure" },
    returnDate:     { mk: "Враќање",    en: "Return" },
    price:          { mk: "Цена (€)",   en: "Price (€)" },
    noTrips:        { mk: "Нема патувања", en: "No trips found" },
    // Team
    addUser:        { mk: "Додај корисник", en: "Add user" },
    email:          { mk: "Е-пошта",     en: "Email" },
    password:       { mk: "Лозинка",     en: "Password" },
    role:           { mk: "Улога",       en: "Role" },
    changePw:       { mk: "Промени лозинка", en: "Change password" },
    remove:         { mk: "Отстрани",   en: "Remove" },
    // Settings
    phone:          { mk: "Телефон",     en: "Phone" },
    address:        { mk: "Адреса",      en: "Address" },
    facebook:       { mk: "Фејсбук URL", en: "Facebook URL" },
    instagram:      { mk: "Инстаграм URL", en: "Instagram URL" },
    saveSettings:   { mk: "Зачувај поставки", en: "Save settings" },
    // Permissions
    permTitle:      { mk: "Дозволи за CRM страници", en: "CRM Page Permissions" },
    permDesc:       { mk: "Контролирај кои CRM страници може да ги отвори секоја улога", en: "Control which CRM pages each role can access" },
    resetDefaults:  { mk: "Врати на почетно", en: "Reset defaults" },
    savePerms:      { mk: "Зачувај дозволи", en: "Save permissions" },
    permMatrix:     { mk: "Матрица на дозволи", en: "Permission matrix" },
  },
  // CRM pages
  crm: {
    // Dashboard
    dashTitle:      { mk: "Почетна",     en: "Dashboard" },
    dashSub:        { mk: "Преглед на CRM активноста", en: "CRM activity overview" },
    totalClients:   { mk: "Вкупно клиенти", en: "Total clients" },
    totalQuotes:    { mk: "Вкупно понуди", en: "Total quotes" },
    totalSales:     { mk: "Вкупно продажби", en: "Total sales" },
    revenue:        { mk: "Приход",      en: "Revenue" },
    profit:         { mk: "Добивка",     en: "Profit" },
    expenses:       { mk: "Трошоци",     en: "Expenses" },
    // Clients
    clientsTitle:   { mk: "Клиенти",    en: "Clients" },
    addClient:      { mk: "Додај клиент", en: "Add client" },
    firstName:      { mk: "Име",         en: "First name" },
    lastName:       { mk: "Презиме",     en: "Last name" },
    emailLabel:     { mk: "Е-пошта",    en: "Email" },
    phoneLabel:     { mk: "Телефон",    en: "Phone" },
    city:           { mk: "Град",        en: "City" },
    country:        { mk: "Држава",     en: "Country" },
    passport:       { mk: "Број на пасош", en: "Passport number" },
    nationality:    { mk: "Националност", en: "Nationality" },
    clientType:     { mk: "Тип на клиент", en: "Client type" },
    notes:          { mk: "Белешки",     en: "Notes" },
    save:           { mk: "Зачувај",     en: "Save" },
    cancel:         { mk: "Откажи",      en: "Cancel" },
    delete:         { mk: "Избриши",     en: "Delete" },
    search:         { mk: "Пребарај...", en: "Search..." },
    noResults:      { mk: "Нема резултати", en: "No results" },
    // Quotes
    quotesTitle:    { mk: "Понуди",      en: "Quotations" },
    addQuote:       { mk: "Нова понуда", en: "New quote" },
    client:         { mk: "Клиент",      en: "Client" },
    destination:    { mk: "Дестинација", en: "Destination" },
    dateFrom:       { mk: "Од",          en: "From" },
    dateTo:         { mk: "До",          en: "To" },
    adults:         { mk: "Возрасни",   en: "Adults" },
    children:       { mk: "Деца",        en: "Children" },
    status:         { mk: "Статус",      en: "Status" },
    priceTotal:     { mk: "Вкупна цена", en: "Total price" },
    // Sales
    salesTitle:     { mk: "Продажби",   en: "Sales" },
    addSale:        { mk: "Нова продажба", en: "New sale" },
    saleDate:       { mk: "Датум",       en: "Date" },
    amount:         { mk: "Износ",       en: "Amount" },
    commission:     { mk: "Провизија",  en: "Commission" },
    // Expenses
    expensesTitle:  { mk: "Трошоци",    en: "Expenses" },
    addExpense:     { mk: "Нов трошок", en: "New expense" },
    category:       { mk: "Категорија", en: "Category" },
    description:    { mk: "Опис",       en: "Description" },
    // Vouchers
    vouchersTitle:  { mk: "Ваучери",    en: "Vouchers" },
    addVoucher:     { mk: "Нов ваучер", en: "New voucher" },
    voucherNum:     { mk: "Број на ваучер", en: "Voucher number" },
    print:          { mk: "Печати",     en: "Print" },
    // Search
    searchTitle:    { mk: "Пребарај летови", en: "Search flights" },
    searchSub:      { mk: "Внеси град или IATA код за да пребараш", en: "Type a city or IATA code to search" },
    from:           { mk: "Од",          en: "From" },
    to:             { mk: "До",          en: "To" },
    date:           { mk: "Датум",       en: "Date" },
    searchBtn:      { mk: "Пребарај на Aviasales ✈️", en: "Search on Aviasales ✈️" },
    searchBtn2:     { mk: "Пребарај на Skyscanner 🔍", en: "Search on Skyscanner 🔍" },
    bookingPlatforms: { mk: "Платформи за резервации", en: "Booking Platforms" },
  },
};

export function t(key: { mk: string; en: string }, lang: StaffLang): string {
  return key[lang];
}
