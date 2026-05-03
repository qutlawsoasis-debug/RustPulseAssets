import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
function makeIcon(path) {
  return function Icon({ size = 14, strokeWidth = 2.5 }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {path}
      </svg>
    );
  };
}

const numberTextStyle = {
  fontFamily: "Arial, Helvetica, Inter, ui-sans-serif, system-ui, sans-serif",
  fontVariantNumeric: "tabular-nums",
};



const Crown = makeIcon(<><path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7z" /><path d="M5 19h14" /></>);
const Shield = makeIcon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />);
const Star = makeIcon(<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1L12 2z" />);
const Hammer = makeIcon(<><path d="M15 12l-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9" /><path d="M17.6 3.6l2.8 2.8" /><path d="M14 7l3-3 3 3-3 3" /></>);
const Wrench = makeIcon(<><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.9 2.9-2.8-2.8 2.7-3.1z" /></>);
const Users = makeIcon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
const Megaphone = makeIcon(<><path d="M3 11v2a2 2 0 0 0 2 2h2l4 4v-7" /><path d="M11 6v12" /><path d="M21 8v8" /><path d="M11 6l10-3v18l-10-3" /></>);
const Video = makeIcon(<><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></>);
const Palette = makeIcon(<><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2a10 10 0 0 0 0 20h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h2a8 8 0 0 0-2-11z" /></>);
const Bug = makeIcon(<><rect x="8" y="6" width="8" height="14" rx="4" /><path d="M3 13h5" /><path d="M16 13h5" /><path d="M4 19l4-2" /><path d="M20 19l-4-2" /><path d="M4 7l4 2" /><path d="M20 7l-4 2" /><path d="M10 6V3" /><path d="M14 6V3" /></>);
const UserCheck = makeIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M17 11l2 2 4-4" /></>);
const UserCog = makeIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><circle cx="18" cy="12" r="3" /><path d="M18 8v1" /><path d="M18 15v1" /><path d="M14 12h1" /><path d="M21 12h1" /></>);
const UserPlus = makeIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6" /><path d="M23 11h-6" /></>);
const User = makeIcon(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
const Award = makeIcon(<><circle cx="12" cy="8" r="6" /><path d="M15.5 13.2L17 22l-5-3-5 3 1.5-8.8" /></>);

const serverIp = "57.128.210.53:28068";
const discordUrl = "https://discord.gg/p4tFuvErfy";
const steamAuthUrl = "/api/auth/steam";
const ADMIN_STEAM_IDS = ["76561199669108822"];


const VEXON_INVENTORY_KEY = "vexon_inventory_v1";

function loadInventory() {
  try {
    const items = JSON.parse(localStorage.getItem(VEXON_INVENTORY_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveInventory(items) {
  try {
    localStorage.setItem(VEXON_INVENTORY_KEY, JSON.stringify(items));
  } catch {
    // ignore storage error
  }
}

function mergeInventory(currentItems, incomingItems) {
  const byKey = new Map(currentItems.map((item) => [`${item.sessionId}:${item.id}:${item.index || 0}`, item]));

  incomingItems.forEach((item, index) => {
    const key = `${item.sessionId}:${item.id}:${index}`;
    if (!byKey.has(key)) {
      byKey.set(key, { ...item, index, status: "ready", createdAt: Date.now() });
    }
  });

  return Array.from(byKey.values());
}


const languages = [
  { code: "en", label: "EN", name: "English", flag: "🇬🇧" },
  { code: "ru", label: "RU", name: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "UK", name: "Українська", flag: "🇺🇦" },
];


const LANG_STORAGE_KEY = "vexon_lang";
const LOADER_STORAGE_KEY = "vexon_loader_last_seen";
const LOADER_COOLDOWN_MS = 60 * 1000;

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(LANG_STORAGE_KEY) || "en";
}

function shouldShowEntryLoader() {
  if (typeof window === "undefined") return true;
  const lastSeen = Number(localStorage.getItem(LOADER_STORAGE_KEY) || 0);
  return Date.now() - lastSeen > LOADER_COOLDOWN_MS;
}

function markEntryLoaderSeen() {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOADER_STORAGE_KEY, String(Date.now()));
  }
}

const roleOptions = [
  "Owner",
  "Co-Owner",
  "Developer",
  "Lead Developer",
  "Admin",
  "Head Admin",
  "Senior Admin",
  "Moderator",
  "Senior Moderator",
  "Trial Moderator",
  "Helper",
  "Support",
  "Builder",
  "Media",
  "Manager",
  "Community Manager",
  "Event Manager",
  "Tester",
  "Designer",
  "Partner",
  "Sponsor",
];

const roleIcons = {
  Owner: Crown,
  "Co-Owner": Crown,
  Developer: Wrench,
  "Lead Developer": Hammer,
  Admin: Shield,
  "Head Admin": Crown,
  "Senior Admin": Award,
  Moderator: UserCheck,
  "Senior Moderator": UserCog,
  "Trial Moderator": UserPlus,
  Helper: Star,
  Support: Users,
  Builder: Hammer,
  Media: Video,
  Manager: Users,
  "Community Manager": Megaphone,
  "Event Manager": Megaphone,
  Tester: Bug,
  Designer: Palette,
  Partner: User,
  Sponsor: Star,
};

function RoleIcon({ role, size = 14 }) {
  const Icon = roleIcons[role] || User;
  return <Icon size={size} strokeWidth={2.5} />;
}

const roleStyles = {
  Owner: { card: "text-red-200 hover:border-red-300/80 hover:shadow-[0_0_42px_rgba(248,113,113,0.35)]", badge: "border-red-300/30 bg-red-500/10 text-red-200", active: "border-red-300/50 bg-red-500/15 text-red-200" },
  "Co-Owner": { card: "text-rose-200 hover:border-rose-300/80 hover:shadow-[0_0_54px_rgba(251,113,133,0.42)]", badge: "border-rose-300/30 bg-rose-500/10 text-rose-200", active: "border-rose-300/50 bg-rose-500/15 text-rose-200" },
  Developer: { card: "text-fuchsia-200 hover:border-fuchsia-300/80 hover:shadow-[0_0_42px_rgba(217,70,239,0.35)]", badge: "border-fuchsia-300/30 bg-fuchsia-500/10 text-fuchsia-200", active: "border-fuchsia-300/50 bg-fuchsia-500/15 text-fuchsia-200" },
  "Lead Developer": { card: "text-purple-200 hover:border-purple-300/80 hover:shadow-[0_0_42px_rgba(192,132,252,0.35)]", badge: "border-purple-300/30 bg-purple-500/10 text-purple-200", active: "border-purple-300/50 bg-purple-500/15 text-purple-200" },
  Admin: { card: "text-orange-200 hover:border-orange-300/80 hover:shadow-[0_0_42px_rgba(251,146,60,0.35)]", badge: "border-orange-300/30 bg-orange-500/10 text-orange-200", active: "border-orange-300/50 bg-orange-500/15 text-orange-200" },
  "Head Admin": { card: "text-amber-200 hover:border-amber-300/80 hover:shadow-[0_0_42px_rgba(251,191,36,0.35)]", badge: "border-amber-300/30 bg-amber-500/10 text-amber-200", active: "border-amber-300/50 bg-amber-500/15 text-amber-200" },
  "Senior Admin": { card: "text-yellow-200 hover:border-yellow-300/80 hover:shadow-[0_0_42px_rgba(250,204,21,0.35)]", badge: "border-yellow-300/30 bg-yellow-500/10 text-yellow-200", active: "border-yellow-300/50 bg-yellow-500/15 text-yellow-200" },
  Moderator: { card: "text-sky-200 hover:border-sky-300/80 hover:shadow-[0_0_42px_rgba(56,189,248,0.35)]", badge: "border-sky-300/30 bg-sky-500/10 text-sky-200", active: "border-sky-300/50 bg-sky-500/15 text-sky-200" },
  "Senior Moderator": { card: "text-cyan-200 hover:border-cyan-300/80 hover:shadow-[0_0_42px_rgba(34,211,238,0.35)]", badge: "border-cyan-300/30 bg-cyan-500/10 text-cyan-200", active: "border-cyan-300/50 bg-cyan-500/15 text-cyan-200" },
  "Trial Moderator": { card: "text-blue-200 hover:border-blue-300/80 hover:shadow-[0_0_42px_rgba(96,165,250,0.35)]", badge: "border-blue-300/30 bg-blue-500/10 text-blue-200", active: "border-blue-300/50 bg-blue-500/15 text-blue-200" },
  Helper: { card: "text-lime-200 hover:border-lime-300/80 hover:shadow-[0_0_50px_rgba(132,204,22,0.42)]", badge: "border-lime-300/30 bg-lime-500/10 text-lime-200", active: "border-lime-300/50 bg-lime-500/15 text-lime-200" },
  Support: { card: "text-emerald-200 hover:border-emerald-300/80 hover:shadow-[0_0_42px_rgba(52,211,153,0.35)]", badge: "border-emerald-300/30 bg-emerald-500/10 text-emerald-200", active: "border-emerald-300/50 bg-emerald-500/15 text-emerald-200" },
  Builder: { card: "text-stone-200 hover:border-stone-300/80 hover:shadow-[0_0_42px_rgba(214,211,209,0.28)]", badge: "border-stone-300/30 bg-stone-500/10 text-stone-200", active: "border-stone-300/50 bg-stone-500/15 text-stone-200" },
  Media: { card: "text-pink-200 hover:border-pink-300/80 hover:shadow-[0_0_42px_rgba(244,114,182,0.35)]", badge: "border-pink-300/30 bg-pink-500/10 text-pink-200", active: "border-pink-300/50 bg-pink-500/15 text-pink-200" },
  Manager: { card: "text-violet-200 hover:border-violet-300/80 hover:shadow-[0_0_42px_rgba(167,139,250,0.35)]", badge: "border-violet-300/30 bg-violet-500/10 text-violet-200", active: "border-violet-300/50 bg-violet-500/15 text-violet-200" },
  "Community Manager": { card: "text-indigo-200 hover:border-indigo-300/80 hover:shadow-[0_0_42px_rgba(129,140,248,0.35)]", badge: "border-indigo-300/30 bg-indigo-500/10 text-indigo-200", active: "border-indigo-300/50 bg-indigo-500/15 text-indigo-200" },
  "Event Manager": { card: "text-teal-200 hover:border-teal-300/80 hover:shadow-[0_0_42px_rgba(45,212,191,0.35)]", badge: "border-teal-300/30 bg-teal-500/10 text-teal-200", active: "border-teal-300/50 bg-teal-500/15 text-teal-200" },
  Tester: { card: "text-green-200 hover:border-green-300/80 hover:shadow-[0_0_42px_rgba(74,222,128,0.35)]", badge: "border-green-300/30 bg-green-500/10 text-green-200", active: "border-green-300/50 bg-green-500/15 text-green-200" },
  Designer: { card: "text-neutral-200 hover:border-neutral-300/80 hover:shadow-[0_0_42px_rgba(229,229,229,0.28)]", badge: "border-neutral-300/30 bg-neutral-500/10 text-neutral-200", active: "border-neutral-300/50 bg-neutral-500/15 text-neutral-200" },
  Partner: { card: "text-rose-100 hover:border-rose-200/80 hover:shadow-[0_0_42px_rgba(255,228,230,0.28)]", badge: "border-rose-200/30 bg-rose-300/10 text-rose-100", active: "border-rose-200/50 bg-rose-300/15 text-rose-100" },
  Sponsor: { card: "text-yellow-100 hover:border-yellow-200/90 hover:shadow-[0_0_64px_rgba(250,204,21,0.52)]", badge: "border-yellow-200/40 bg-yellow-300/12 text-yellow-100 shadow-[0_0_22px_rgba(250,204,21,0.18)]", active: "border-yellow-200/70 bg-yellow-300/20 text-yellow-100 shadow-[0_0_30px_rgba(250,204,21,0.32)]" },
};

const fallbackRoleStyle = {
  card: "text-zinc-200 hover:border-white/50 hover:shadow-[0_0_42px_rgba(255,255,255,0.16)]",
  badge: "border-white/20 bg-white/10 text-zinc-200",
  active: "border-white/40 bg-white/15 text-white",
};

function getRoleStyle(role) {
  return roleStyles[role] || fallbackRoleStyle;
}

function getMemberRoles(member) {
  if (Array.isArray(member?.roles)) return member.roles.filter(Boolean);
  return String(member?.role || "Support")
    .split("/")
    .map((role) => role.trim())
    .filter(Boolean);
}

function getPrimaryRole(member) {
  return getMemberRoles(member)[0] || "Support";
}

function buildRoleValue(roles) {
  return roles.filter(Boolean).join("/");
}

const featureSets = {
  en: [
    ["2X Rates", "Faster farming without losing the survival feel."],
    ["3 Day Wipe", "Fresh starts often, no dead late game."],
    ["Team Limit 3", "Cleaner fights and less zerg pressure."],
    ["Kits & TP", "Comfort tools without turning into pay-to-win."],
    ["Custom Systems", "Extra server-side features for smoother gameplay."],
    ["Optimized Gameplay", "Balanced systems designed to improve gameplay without clutter or pay-to-win mechanics."],
    ["Active Support", "Fast admin response and active moderation."],
  ],
  ru: [
    ["2X рейты", "Быстрый фарм без потери вайба выживания."],
    ["Вайп 3 дня", "Частые свежие старты без мёртвого лейта."],
    ["Команда до 3", "Чище PvP и меньше давления зергов."],
    ["Киты и TP", "Комфорт без pay-to-win."],
    ["Кастомные системы", "Дополнительные серверные механики для более плавной игры."],
    ["Оптимизированный геймплей", "Сбалансированные системы, которые улучшают игру без перегруза и pay-to-win."],
    ["Активная поддержка", "Быстрая реакция администрации и активная модерация."],
  ],
  uk: [
    ["2X рейти", "Швидший фарм без втрати вайбу виживання."],
    ["Вайп 3 дні", "Часті свіжі старти без мертвого лейту."],
    ["Команда до 3", "Чистіше PvP і менше тиску зерґів."],
    ["Кіти та TP", "Комфорт без pay-to-win."],
    ["Кастомні системи", "Додаткові серверні механіки для плавнішої гри."],
    ["Оптимізований геймплей", "Збалансовані системи, що покращують гру без перевантаження та pay-to-win."],
    ["Активна підтримка", "Швидка реакція адміністрації та активна модерація."],
  ],
};

const content = {
  en: {
    nav: [["Home", "#home"], ["Server Info", "#server-info"], ["Features", "#features"], ["Players", "#players"], ["Shop", "#shop"], ["Team", "#team"], ["Connect", "#connect"], ["Rules", "#rules"]],
    heroText: "2X Rust server with fast wipes, balanced PvP and custom systems built for smoother gameplay.",
    copy: "Copy server IP",
    copied: "Copied",
    discord: "Join Discord",
    steam: "Sign in",
    accountEyebrow: "Account",
    profileTitle: "Profile",
    settingsTitle: "Settings",
    back: "Back",
    logout: "Logout",
    profileStatsPlaytime: "Playtime",
    profileStatsKills: "Kills",
    profileStatsDeaths: "Deaths",
    profileStatsKd: "K/D",
    profileNoPrivilegeTitle: "No active privilege",
    profileNoPrivilegeText: "You do not have an active VIP package right now. Buy a package in the shop and activate it from your inventory when you are ready.",
    profileActivePrivilege: "Active privilege",
    profileExpiresIn: "Expires in",
    profilePrivilegePerks: "Included perks",
    profileRemovePrivilege: "Remove privilege",
    profileRemovingPrivilege: "Removing...",
    profileRemoveSuccess: "Privilege removal queued.",
    profileRemoveError: "Unable to remove privilege.",
    profilePurchaseHistory: "Purchase history",
    profileDeliveryLog: "VIP delivery log",
    profileNoOrders: "No purchases yet.",
    profileNoLogs: "No delivery logs yet.",
    profileDate: "Date",
    profileDays: "days",
    profileGoShop: "Go to shop",
    settingsProfile: "Profile",
    settingsSteamAccount: "Steam account",
    settingsSteamConnected: "is connected to VEXON.",
    settingsLinked: "Linked",
    settingsNotLinked: "Not linked",
    settingsInterface: "Interface",
    settingsLanguage: "Language",
    settingsPrivacy: "Privacy",
    settingsVisibility: "Visibility",
    settingsPublicProfile: "Public profile",
    settingsPublicProfileText: "Allow others to open your profile from the Players leaderboard",
    publicProfileHiddenTitle: "Profile is hidden",
    publicProfileHiddenText: "This player has disabled public profile viewing.",
    publicProfileOpen: "Open profile",
    publicProfileBadge: "Wipe statistics",
    playerStatsTitle: "Player activity",
    playerStatsText: "Server statistics for this wipe: combat, farming, gathering and world actions.",
    statsSyncing: "Waiting for server sync",
    statsCombat: "Combat",
    statsWorld: "World",
    statsGather: "Gathering",
    statsFarming: "Farming",
    statsExplosions: "Explosions",
    statsTotalFarmed: "Total farmed",
    statsNoData: "No data yet",
    statNpcKills: "NPC kills",
    statAnimalKills: "Animal kills",
    statHelicopters: "Helicopters",
    statBradley: "Bradley",
    statCratesOpened: "Crates opened",
    statBarrelsDestroyed: "Barrels destroyed",
    statBuildingsPlaced: "Buildings placed",
    statCraftedItems: "Crafted items",
    statWood: "Wood",
    statStone: "Stone",
    statMetalOre: "Metal ore",
    statSulfurOre: "Sulfur ore",
    statHqmOre: "HQM ore",
    statScrap: "Scrap",
    statRocketBasic: "Rocket (Basic)",
    statRocketHv: "Rocket (HV)",
    statRocketFire: "Rocket (Incendiary)",
    statC4: "C4",
    statSatchel: "Satchel",
    statExplosiveAmmo: "Explosive ammo",
    statsCombatText: "Combat activity and PvE events.",
    statsWorldText: "Looting, crafting and building activity.",
    statsGatherText: "Resources collected during the current wipe.",
    statsExplosionsText: "Explosives and raid activity.",
    settingsAdmin: "Admin",
    settingsEditorMode: "Editor Mode",
    settingsEnableEditor: "Enable site editor",
    settingsEditorText: "Show edit controls for Shop and Team sections.",
    settingsSession: "Session",
    settingsLogoutTitle: "Logout",
    settingsLogoutText: "Disconnect this browser session.",
    profileMenuProfile: "My Profile",
    profileMenuInventory: "Inventory",
    profileMenuSettings: "Settings",
    profileMenuLogout: "Logout",
    profileBalance: "Balance",
    profileOrders: "Orders",
    profileVipInactive: "No active VIP",
    profileBuyVip: "Buy VIP",
    profileExtendVip: "Extend VIP",
    profileSteamLinked: "Steam linked",
    profileIncluded: "Included",
    inventoryText: "Paid privileges appear here first. Activate them only when you are ready to receive the package on your Steam account.",
    inventoryReady: "Ready",
    inventoryRevoked: "Force ended",
    inventoryConfirm: "Activate this item for SteamID",
    shopTitle: "Shop",
    shopText: "Support the server and unlock useful perks without breaking gameplay balance.",
    shopFeatured: "Popular",
    shopAddItem: "+ Add shop item",
    shopAddToCart: "Add to cart",
    shopCart: "Cart",
    shopCheckout: "Checkout",
    shopPayStripe: "Pay with Stripe",
    shopPayCoins: "Pay with Vexon Coins",
    shopCoinsPrice: "V-Coins",
    shopCoinsBalance: "Balance",
    shopCoinsNotEnough: "Not enough Vexon Coins.",
    shopCoinsSuccess: "Purchase completed with Vexon Coins.",
    settingsGrantCoins: "Give Vexon Coins",
    settingsGrantCoinsText: "Add or remove site balance for any SteamID.",
    settingsTargetSteamId: "Target SteamID",
    settingsCoinsAmount: "Coins amount",
    settingsCoinsReason: "Reason",
    settingsGrantCoinsButton: "Apply balance change",
    settingsGrantCoinsSuccess: "Balance updated.",
    settingsGrantCoinsError: "Unable to update balance.",
    shopEmpty: "Cart is empty.",
    shopClear: "Clear",
    shopRemove: "Remove",
    shopTotal: "Total",
    shopAdmin: "Admin",
    shopEditItem: "Edit item",
    shopEdit: "Edit",
    shopDelete: "Delete",
    shopSaveChanges: "Save changes",
    shopName: "Name",
    shopPrice: "Price",
    shopCurrency: "Currency",
    shopTag: "Tag",
    shopCategory: "Category",
    shopPopularItem: "Popular item",
    shopPerks: "Perks",
    shopAddPerk: "+ Perk",
    shopNewItemName: "NEW ITEM",
    shopNewItemTag: "NEW",
    shopNewPerk: "New perk",
    shopEditableItem: "Editable item",
    shopDeliveryNote: "Purchase will be delivered to the Steam account shown above. Make sure you are signed into the correct account before checkout.",
    shopCategories: [
      { id: "vip", label: "VIP" },
      { id: "kit", label: "KIT" },
      { id: "cosmetic", label: "COSMETIC" },
    ],
    shopItems: [
      { id: "vip_30d", category: "vip", name: "VEXON VIP", price: 7.99, currency: "$", tag: "30 DAYS", popular: true, perks: ["Priority in the queue", "Home Recycler Craft /rec", "Weapons, armor, and tools do not break", "3 chat prefixes to choose from", "More teleportation/house points", "Access to the /skinbox command", "Load custom images to signs from a remote URL", "Set plant genes with /setgenes (example: YYYGGG)", "Access to the /grade command"] },
      { id: "sponsor_30d", category: "vip", name: "SPONSOR", price: 9.99, currency: "$", tag: "30 DAYS", popular: true, perks: ["Everything that is in VIP", "Any custom server prefix up to 12 characters"] },
      { id: "premium_kit_weekly", category: "kit", name: "PREMIUM KIT", price: 2.99, currency: "$", tag: "WEEKLY", popular: false, perks: ["Balanced resources", "No pay-to-win", "Wipe ready"] },
      { id: "name_color", category: "cosmetic", name: "NAME COLOR", price: 1.99, currency: "$", tag: "COSMETIC", popular: false, perks: ["Chat highlight", "Profile accent", "Permanent"] },
    ],
    featuresTitle: "Built for clean Rust action",
    featuresText: "Fast progression, fair fights and server systems that help gameplay without ruining balance.",
    features: featureSets.en,
    connectTitle: "Connect instantly",
    connectText: "Open Rust, press F1, paste the command below and join VEXON.",
    rulesTitle: "Server rules",
    rulesText: "Simple rules for a clean wipe and fair PvP.",
    rules: ["No cheats, scripts or recoil macros", "No exploits or bug abuse", "Respect admin decisions", "Maximum team size: 3 players"],
    teamTitle: "Server Team",
    teamText: "Meet the people behind VEXON Rust.",
    teamAdminText: "Admin edit mode is enabled for your Steam account.",
    teamStory: "VEXON Rust is managed by a small team that keeps the server clean, stable and fair. We monitor reports, support players during wipes and maintain the systems behind the server without getting in the way of gameplay.",
    addMember: "+ Add member",
    loadingTeam: "Loading team...",
    deleteMember: "Delete member",
    nicknamePrompt: "Nickname",
    chooseRoles: "Choose roles",
    serverInfoEyebrow: "Server Info",
    serverDescription: "Live VEXON Rust status, player count, wipe timer and connection details in one place.",
    status: "Status",
    players: "Players",
    leaderboardTitle: "Server leaderboard",
    leaderboardText: "",
    top10: "Top 10",
    statsAllTime: "All time",
    statsThisWipe: "This wipe",
    allPlayers: "All players",
    map: "Map",
    mapSize: "Map Size",
    online: "Online",
    loading: "Loading",
    offline: "Offline",
    nextWipe: "Next wipe",
    cycleProgress: "Cycle progress",
    day: "Day",
    serverNote: "Server pulse",
    serverNoteTitle: "Server status without extra noise",
    serverNoteText: "Check online activity, wipe progress and map details in one clean place.",
    vote: "Vote",
    type: "Type",
    active: "Active",
    off: "Off",
    connectSteps: ["Open Rust", "Press F1", "Paste command", "Join VEXON"],
    rulesEyebrow: "Rules",
    pleaseWait: "Please wait...",
    entryWelcome: "Welcome",
    entryLoading: "Preparing the site and loading server data.",
    steamRedirectTitle: "Redirecting to Steam",
    steamRedirectText: "Please wait, we are opening Steam authorization.",
    logoutConfirmTitle: "Are you sure you want to log out?",
    cancel: "Cancel",
    logout: "Logout",
    changingLanguage: "Changing language",
    footer: "All rights reserved.",
  },
  ru: {
    nav: [["Главная", "#home"], ["Сервер", "#server-info"], ["Фичи", "#features"], ["Игроки", "#players"], ["Магазин", "#shop"], ["Команда", "#team"], ["Подключение", "#connect"], ["Правила", "#rules"]],
    heroText: "Rust 2X сервер с быстрыми вайпами, сбалансированным PvP и кастомными системами для более плавной игры.",
    copy: "Скопировать IP",
    copied: "Скопировано",
    discord: "Discord",
    steam: "Войти",
    accountEyebrow: "Аккаунт",
    profileTitle: "Профиль",
    settingsTitle: "Настройки",
    back: "Назад",
    logout: "Выйти",
    profileStatsPlaytime: "Время",
    profileStatsKills: "Убийства",
    profileStatsDeaths: "Смерти",
    profileStatsKd: "K/D",
    profileNoPrivilegeTitle: "Нет активной привилегии",
    profileNoPrivilegeText: "Сейчас у тебя нет активного VIP пакета. Купи пакет в магазине и активируй его из инвентаря, когда будешь готов.",
    profileActivePrivilege: "Активная привилегия",
    profileExpiresIn: "Истекает через",
    profilePrivilegePerks: "Что входит",
    profileRemovePrivilege: "Удалить привилегию",
    profileRemovingPrivilege: "Удаляем...",
    profileRemoveSuccess: "Удаление привилегии поставлено в очередь.",
    profileRemoveError: "Не удалось удалить привилегию.",
    profilePurchaseHistory: "История покупок",
    profileDeliveryLog: "Лог выдачи VIP",
    profileNoOrders: "Покупок пока нет.",
    profileNoLogs: "Логов выдачи пока нет.",
    profileDate: "Дата",
    profileDays: "дней",
    profileGoShop: "В магазин",
    settingsProfile: "Профиль",
    settingsSteamAccount: "Steam аккаунт",
    settingsSteamConnected: "подключён к VEXON.",
    settingsLinked: "Привязан",
    settingsNotLinked: "Не привязан",
    settingsInterface: "Интерфейс",
    settingsLanguage: "Язык",
    settingsPrivacy: "Приватность",
    settingsVisibility: "Видимость",
    settingsPublicProfile: "Публичный профиль",
    settingsPublicProfileText: "Разрешить другим видеть твою статистику в рейтинге игроков",
    publicProfileHiddenTitle: "Профиль скрыт",
    publicProfileHiddenText: "Этот игрок отключил публичный просмотр профиля.",
    publicProfileOpen: "Открыть профиль",
    publicProfileBadge: "Статистика вайпа",
    playerStatsTitle: "Статистика игрока",
    playerStatsText: "Активность игрока за текущий вайп: бои, добыча ресурсов и рейды.",
    statsCombat: "Бой",
    statsWorld: "Мир",
    statsGather: "Добыча",
    statsFarming: "Ферма",
    statsExplosions: "Рейды",
    statsTotalFarmed: "Всего добыто",
    statsNoData: "Данных пока нет",
    statsCombatText: "Активность в бою и PvE события.",
    statsWorldText: "Лут, крафт и строительство.",
    statsGatherText: "Собранные ресурсы за текущий вайп.",
    statsExplosionsText: "Использованная взрывчатка и рейд активность.",
    statNpcKills: "NPC убийства",
    statAnimalKills: "Животные",
    statHelicopters: "Вертолеты",
    statBradley: "Брэдли",
    statCratesOpened: "Ящики",
    statBarrelsDestroyed: "Бочки",
    statBuildingsPlaced: "Постройки",
    statCraftedItems: "Скрафчено",
    statWood: "Дерево",
    statStone: "Камень",
    statMetalOre: "Металл",
    statSulfurOre: "Сера",
    statHqmOre: "HQM",
    statScrap: "Скрап",
    statRocketBasic: "Ракета (обычная)",
    statRocketHv: "Ракета (HV)",
    statRocketFire: "Ракета (зажиг.)",
    statC4: "C4",
    statSatchel: "Сэтчел",
    statExplosiveAmmo: "Взрывные патроны",
    settingsAdmin: "Админ",
    settingsEditorMode: "Режим редактора",
    settingsEnableEditor: "Включить редактор сайта",
    settingsEditorText: "Показывать кнопки редактирования для магазина и команды.",
    settingsSession: "Сессия",
    settingsLogoutTitle: "Выход",
    settingsLogoutText: "Отключить эту сессию браузера.",
    profileMenuProfile: "Профиль",
    profileMenuInventory: "Инвентарь",
    profileMenuSettings: "Настройки",
    profileMenuLogout: "Выйти",
    profileBalance: "Баланс",
    profileOrders: "Заказы",
    profileVipInactive: "VIP не активен",
    profileBuyVip: "Купить VIP",
    profileExtendVip: "Продлить VIP",
    profileSteamLinked: "Steam привязан",
    profileIncluded: "Включено",
    inventoryText: "Оплаченные привилегии сначала появляются здесь. Активируй их только тогда, когда готов получить пакет на свой Steam аккаунт.",
    inventoryReady: "Готово",
    inventoryRevoked: "Принудительно завершено",
    inventoryConfirm: "Активировать этот товар для SteamID",
    checkoutPreparingTitle: "Подготавливаем ваш товар",
    checkoutPreparingText: "Перенаправляем на безопасную оплату Stripe...",
    inventoryTitle: "Инвентарь",
    inventoryActivate: "Активировать",
    inventoryActivated: "Активировано",
    inventoryEmpty: "Инвентарь пуст. Оплаченные товары появятся здесь после оплаты.",
    shopTitle: "Магазин",
    shopText: "Поддержи сервер и открой полезные бонусы без нарушения игрового баланса.",
    shopFeatured: "Популярное",
    shopAddItem: "+ Добавить товар",
    shopAddToCart: "Добавить в корзину",
    shopCart: "Корзина",
    shopCheckout: "Оплатить",
    shopPayStripe: "Оплатить через Stripe",
    shopPayCoins: "Оплатить Vexon Coins",
    shopCoinsPrice: "V-Coins",
    shopCoinsBalance: "Баланс",
    shopCoinsNotEnough: "Недостаточно Vexon Coins.",
    shopCoinsSuccess: "Покупка через Vexon Coins завершена.",
    settingsGrantCoins: "Выдать Vexon Coins",
    settingsGrantCoinsText: "Добавь или сними баланс сайта по SteamID.",
    settingsTargetSteamId: "SteamID игрока",
    settingsCoinsAmount: "Количество Coins",
    settingsCoinsReason: "Причина",
    settingsGrantCoinsButton: "Изменить баланс",
    settingsGrantCoinsSuccess: "Баланс обновлён.",
    settingsGrantCoinsError: "Не удалось обновить баланс.",
    shopEmpty: "Корзина пуста.",
    shopClear: "Очистить",
    shopRemove: "Удалить",
    shopTotal: "Итого",
    shopAdmin: "Админ",
    shopEditItem: "Редактировать товар",
    shopEdit: "Изменить",
    shopDelete: "Удалить",
    shopSaveChanges: "Сохранить",
    shopName: "Название",
    shopPrice: "Цена",
    shopCurrency: "Валюта",
    shopTag: "Метка",
    shopCategory: "Категория",
    shopPopularItem: "Популярный товар",
    shopPerks: "Бонусы",
    shopAddPerk: "+ Бонус",
    shopNewItemName: "НОВЫЙ ТОВАР",
    shopNewItemTag: "НОВЫЙ",
    shopNewPerk: "Новый бонус",
    shopEditableItem: "Редактируемый товар",
    shopDeliveryNote: "Покупка будет выдана на Steam аккаунт, показанный выше. Перед оплатой убедись, что вошёл в правильный аккаунт.",
    shopCategories: [
      { id: "vip", label: "VIP" },
      { id: "kit", label: "KIT" },
      { id: "cosmetic", label: "КОСМЕТИКА" },
    ],
    shopItems: [
      { id: "vip_30d", category: "vip", name: "VEXON VIP", price: 7.99, currency: "$", tag: "30 ДНЕЙ", popular: true, perks: ["Приоритет в очереди", "Домашний переработчик /rec", "Оружие, броня и инструменты не ломаются", "3 префикса чата на выбор", "Больше телепортов и домов", "Доступ к команде /skinbox", "Загрузка изображений на таблички по URL", "Установка генов растений /setgenes (пример: YYYGGG)", "Доступ к команде /grade"] },
      { id: "sponsor_30d", category: "vip", name: "SPONSOR", price: 9.99, currency: "$", tag: "30 ДНЕЙ", popular: true, perks: ["Всё, что входит в VIP", "Любой кастомный серверный префикс до 12 символов"] },
      { id: "premium_kit_weekly", category: "kit", name: "PREMIUM KIT", price: 2.99, currency: "$", tag: "НЕДЕЛЯ", popular: false, perks: ["Сбалансированные ресурсы", "Без pay-to-win", "Готово к вайпу"] },
      { id: "name_color", category: "cosmetic", name: "NAME COLOR", price: 1.99, currency: "$", tag: "КОСМЕТИКА", popular: false, perks: ["Выделение в чате", "Акцент профиля", "Навсегда"] },
    ],
    featuresTitle: "Сделано для чистого Rust экшена",
    featuresText: "Быстрый прогресс, честные драки и системы, которые помогают игре без ломания баланса.",
    features: featureSets.ru,
    connectTitle: "Быстрое подключение",
    connectText: "Открой Rust, нажми F1, вставь команду ниже и заходи на VEXON.",
    rulesTitle: "Правила сервера",
    rulesText: "Простые правила для чистого вайпа и честного PvP.",
    rules: ["Без читов, скриптов и макросов", "Без багов и эксплойтов", "Решения администрации обязательны", "Максимум 3 игрока в команде"],
    teamTitle: "Команда сервера",
    teamText: "Люди, которые следят за VEXON Rust.",
    teamAdminText: "Режим редактирования включён для твоего Steam аккаунта.",
    teamStory: "VEXON Rust поддерживает небольшая команда, которая следит за чистой, стабильной и честной игрой. Мы разбираем жалобы, помогаем игрокам во время вайпов и поддерживаем серверные системы, не мешая самому геймплею.",
    addMember: "+ Добавить участника",
    loadingTeam: "Загрузка команды...",
    deleteMember: "Удалить участника",
    nicknamePrompt: "Никнейм",
    chooseRoles: "Выбрать роли",
    serverInfoEyebrow: "Информация о сервере",
    serverDescription: "Живой статус VEXON Rust, онлайн, таймер вайпа и данные для подключения в одном месте.",
    status: "Статус",
    players: "Игроки",
    leaderboardTitle: "Топ игроков сервера",
    leaderboardText: "",
    top10: "Топ 10",
    statsAllTime: "За всё время",
    statsThisWipe: "За этот вайп",
    allPlayers: "Все игроки",
    map: "Карта",
    mapSize: "Размер карты",
    online: "Онлайн",
    loading: "Загрузка",
    offline: "Оффлайн",
    nextWipe: "Следующий вайп",
    cycleProgress: "Прогресс цикла",
    day: "День",
    serverNote: "Пульс сервера",
    serverNoteTitle: "Статус сервера без лишнего шума",
    serverNoteText: "Проверяй онлайн, прогресс вайпа и данные карты в одном удобном месте.",
    vote: "Голосование",
    type: "Тип",
    active: "Активно",
    off: "Выкл",
    connectSteps: ["Открой Rust", "Нажми F1", "Вставь команду", "Заходи на VEXON"],
    rulesEyebrow: "Правила",
    pleaseWait: "Пожалуйста, подождите...",
    entryWelcome: "Добро пожаловать",
    entryLoading: "Подготавливаем сайт и загружаем данные сервера.",
    steamRedirectTitle: "Переходим в Steam",
    steamRedirectText: "Подождите, открываем авторизацию Steam.",
    logoutConfirmTitle: "Вы точно хотите выйти?",
    cancel: "Отмена",
    logout: "Выйти",
    changingLanguage: "Меняем язык",
    footer: "Все права защищены.",
  },
  uk: {
    nav: [["Головна", "#home"], ["Сервер", "#server-info"], ["Фічі", "#features"], ["Гравці", "#players"], ["Магазин", "#shop"], ["Команда", "#team"], ["Підключення", "#connect"], ["Правила", "#rules"]],
    heroText: "Rust 2X сервер зі швидкими вайпами, збалансованим PvP та кастомними системами для плавнішої гри.",
    copy: "Скопіювати IP",
    copied: "Скопійовано",
    discord: "Discord",
    steam: "Увійти",
    accountEyebrow: "Акаунт",
    profileTitle: "Профіль",
    settingsTitle: "Налаштування",
    back: "Назад",
    logout: "Вийти",
    profileStatsPlaytime: "Час",
    profileStatsKills: "Вбивства",
    profileStatsDeaths: "Смерті",
    profileStatsKd: "K/D",
    profileNoPrivilegeTitle: "Немає активної привілеї",
    profileNoPrivilegeText: "Зараз у тебе немає активного VIP пакета. Купи пакет у магазині та активуй його з інвентаря, коли будеш готовий.",
    profileActivePrivilege: "Активна привілея",
    profileExpiresIn: "Закінчується через",
    profilePrivilegePerks: "Що входить",
    profileRemovePrivilege: "Видалити привілей",
    profileRemovingPrivilege: "Видаляємо...",
    profileRemoveSuccess: "Видалення привілею поставлено в чергу.",
    profileRemoveError: "Не вдалося видалити привілей.",
    profilePurchaseHistory: "Історія покупок",
    profileDeliveryLog: "Лог видачі VIP",
    profileNoOrders: "Покупок поки немає.",
    profileNoLogs: "Логів видачі поки немає.",
    profileDate: "Дата",
    profileDays: "днів",
    profileGoShop: "До магазину",
    settingsProfile: "Профіль",
    settingsSteamAccount: "Steam акаунт",
    settingsSteamConnected: "підключений до VEXON.",
    settingsLinked: "Привʼязаний",
    settingsNotLinked: "Не привʼязаний",
    settingsInterface: "Інтерфейс",
    settingsLanguage: "Мова",
    settingsPrivacy: "Приватність",
    settingsVisibility: "Видимість",
    settingsPublicProfile: "Публічний профіль",
    settingsPublicProfileText: "Дозволити іншим бачити твою статистику в рейтингу гравців",
    publicProfileHiddenTitle: "Профіль приховано",
    publicProfileHiddenText: "Цей гравець вимкнув публічний перегляд профілю.",
    publicProfileOpen: "Відкрити профіль",
    publicProfileBadge: "Статистика вайпу",
    playerStatsTitle: "Статистика гравця",
    playerStatsText: "Активність гравця за поточний вайп: бої, збір ресурсів і рейди.",
    statsCombat: "Бій",
    statsWorld: "Світ",
    statsGather: "Збір",
    statsFarming: "Ферма",
    statsExplosions: "Рейди",
    statsTotalFarmed: "Усього зібрано",
    statsNoData: "Даних поки немає",
    statsCombatText: "Бойова активність та PvE події.",
    statsWorldText: "Лут, крафт і будівництво.",
    statsGatherText: "Зібрані ресурси за поточний вайп.",
    statsExplosionsText: "Використана вибухівка та рейд активність.",
    statNpcKills: "NPC вбивства",
    statAnimalKills: "Тварини",
    statHelicopters: "Гелікоптери",
    statBradley: "Бредлі",
    statCratesOpened: "Ящики",
    statBarrelsDestroyed: "Бочки",
    statBuildingsPlaced: "Будівлі",
    statCraftedItems: "Скрафтено",
    statWood: "Дерево",
    statStone: "Камінь",
    statMetalOre: "Метал",
    statSulfurOre: "Сірка",
    statHqmOre: "HQM",
    statScrap: "Скрап",
    statRocketBasic: "Ракета (звичайна)",
    statRocketHv: "Ракета (HV)",
    statRocketFire: "Ракета (запалюв.)",
    statC4: "C4",
    statSatchel: "Сетчел",
    statExplosiveAmmo: "Вибухові патрони",
    settingsAdmin: "Адмін",
    settingsEditorMode: "Режим редактора",
    settingsEnableEditor: "Увімкнути редактор сайту",
    settingsEditorText: "Показувати кнопки редагування для магазину та команди.",
    settingsSession: "Сесія",
    settingsLogoutTitle: "Вихід",
    settingsLogoutText: "Відключити цю сесію браузера.",
    profileMenuProfile: "Профіль",
    profileMenuInventory: "Інвентар",
    profileMenuSettings: "Налаштування",
    profileMenuLogout: "Вийти",
    profileBalance: "Баланс",
    profileOrders: "Замовлення",
    profileVipInactive: "VIP не активний",
    profileBuyVip: "Купити VIP",
    profileExtendVip: "Продовжити VIP",
    profileSteamLinked: "Steam привʼязаний",
    profileIncluded: "Включено",
    inventoryText: "Оплачені привілеї спочатку зʼявляються тут. Активуй їх лише тоді, коли готовий отримати пакет на свій Steam акаунт.",
    inventoryReady: "Готово",
    inventoryRevoked: "Примусово завершено",
    inventoryConfirm: "Активувати цей товар для SteamID",
    checkoutPreparingTitle: "Готуємо ваш товар",
    checkoutPreparingText: "Перенаправляємо на безпечну оплату Stripe...",
    inventoryTitle: "Інвентар",
    inventoryActivate: "Активувати",
    inventoryActivated: "Активовано",
    inventoryEmpty: "Інвентар порожній. Оплачені товари зʼявляться тут після оплати.",
    shopTitle: "Магазин",
    shopText: "Підтримай сервер і відкрий корисні бонуси без порушення ігрового балансу.",
    shopFeatured: "Популярне",
    shopAddItem: "+ Додати товар",
    shopAddToCart: "Додати в кошик",
    shopCart: "Кошик",
    shopCheckout: "Оплатити",
    shopPayStripe: "Оплатити через Stripe",
    shopPayCoins: "Оплатити Vexon Coins",
    shopCoinsPrice: "V-Coins",
    shopCoinsBalance: "Баланс",
    shopCoinsNotEnough: "Недостатньо Vexon Coins.",
    shopCoinsSuccess: "Покупку через Vexon Coins завершено.",
    settingsGrantCoins: "Видати Vexon Coins",
    settingsGrantCoinsText: "Додай або зніми баланс сайту за SteamID.",
    settingsTargetSteamId: "SteamID гравця",
    settingsCoinsAmount: "Кількість Coins",
    settingsCoinsReason: "Причина",
    settingsGrantCoinsButton: "Змінити баланс",
    settingsGrantCoinsSuccess: "Баланс оновлено.",
    settingsGrantCoinsError: "Не вдалося оновити баланс.",
    shopEmpty: "Кошик порожній.",
    shopClear: "Очистити",
    shopRemove: "Видалити",
    shopTotal: "Разом",
    shopAdmin: "Адмін",
    shopEditItem: "Редагувати товар",
    shopEdit: "Змінити",
    shopDelete: "Видалити",
    shopSaveChanges: "Зберегти",
    shopName: "Назва",
    shopPrice: "Ціна",
    shopCurrency: "Валюта",
    shopTag: "Мітка",
    shopCategory: "Категорія",
    shopPopularItem: "Популярний товар",
    shopPerks: "Бонуси",
    shopAddPerk: "+ Бонус",
    shopNewItemName: "НОВИЙ ТОВАР",
    shopNewItemTag: "НОВИЙ",
    shopNewPerk: "Новий бонус",
    shopEditableItem: "Редагований товар",
    shopDeliveryNote: "Покупка буде видана на Steam акаунт, показаний вище. Перед оплатою переконайся, що увійшов у правильний акаунт.",
    shopCategories: [
      { id: "vip", label: "VIP" },
      { id: "kit", label: "KIT" },
      { id: "cosmetic", label: "КОСМЕТИКА" },
    ],
    shopItems: [
      { id: "vip_30d", category: "vip", name: "VEXON VIP", price: 7.99, currency: "$", tag: "30 ДНІВ", popular: true, perks: ["Пріоритет у черзі", "Домашній переробник /rec", "Зброя, броня та інструменти не ламаються", "3 префікси чату на вибір", "Більше телепортів і домів", "Доступ до команди /skinbox", "Завантаження зображень на таблички по URL", "Встановлення генів рослин /setgenes (приклад: YYYGGG)", "Доступ до команди /grade"] },
      { id: "sponsor_30d", category: "vip", name: "SPONSOR", price: 9.99, currency: "$", tag: "30 ДНІВ", popular: true, perks: ["Усе, що входить у VIP", "Будь-який кастомний серверний префікс до 12 символів"] },
      { id: "premium_kit_weekly", category: "kit", name: "PREMIUM KIT", price: 2.99, currency: "$", tag: "ТИЖДЕНЬ", popular: false, perks: ["Збалансовані ресурси", "Без pay-to-win", "Готово до вайпу"] },
      { id: "name_color", category: "cosmetic", name: "NAME COLOR", price: 1.99, currency: "$", tag: "КОСМЕТИКА", popular: false, perks: ["Виділення в чаті", "Акцент профілю", "Назавжди"] },
    ],
    featuresTitle: "Створено для чистого Rust екшену",
    featuresText: "Швидкий прогрес, чесні бої та системи, які допомагають грі без ламання балансу.",
    features: featureSets.uk,
    connectTitle: "Швидке підключення",
    connectText: "Відкрий Rust, натисни F1, встав команду нижче та заходь на VEXON.",
    rulesTitle: "Правила сервера",
    rulesText: "Прості правила для чистого вайпу та чесного PvP.",
    rules: ["Без чітів, скриптів і макросів", "Без багів та експлойтів", "Рішення адміністрації обов’язкові", "Максимум 3 гравці в команді"],
    teamTitle: "Команда сервера",
    teamText: "Люди, які стежать за VEXON Rust.",
    teamAdminText: "Режим редагування увімкнено для твого Steam акаунта.",
    teamStory: "VEXON Rust підтримує невелика команда, яка стежить за чистою, стабільною та чесною грою. Ми розглядаємо скарги, допомагаємо гравцям під час вайпів і підтримуємо серверні системи, не заважаючи самому геймплею.",
    addMember: "+ Додати учасника",
    loadingTeam: "Завантаження команди...",
    deleteMember: "Видалити учасника",
    nicknamePrompt: "Нікнейм",
    chooseRoles: "Вибрати ролі",
    serverInfoEyebrow: "Інформація про сервер",
    serverDescription: "Живий статус VEXON Rust, онлайн, таймер вайпу та дані для підключення в одному місці.",
    status: "Статус",
    players: "Гравці",
    leaderboardTitle: "Топ гравців сервера",
    leaderboardText: "",
    top10: "Топ 10",
    statsAllTime: "За весь час",
    statsThisWipe: "За цей вайп",
    allPlayers: "Усі гравці",
    map: "Карта",
    mapSize: "Розмір карти",
    online: "Онлайн",
    loading: "Завантаження",
    offline: "Офлайн",
    nextWipe: "Наступний вайп",
    cycleProgress: "Прогрес циклу",
    day: "День",
    serverNote: "Пульс сервера",
    serverNoteTitle: "Усе важливе видно одразу",
    serverNoteText: "Стеж за активністю сервера, прогресом вайпу та голосуванням за карту без зайвих дашбордів і Discord-каналів.",
    vote: "Голосування",
    type: "Тип",
    active: "Активно",
    off: "Вимк",
    connectSteps: ["Відкрий Rust", "Натисни F1", "Встав команду", "Заходь на VEXON"],
    rulesEyebrow: "Правила",
    pleaseWait: "Будь ласка, зачекайте...",
    entryWelcome: "Ласкаво просимо",
    entryLoading: "Готуємо сайт і завантажуємо дані сервера.",
    steamRedirectTitle: "Переходимо до Steam",
    steamRedirectText: "Зачекайте, відкриваємо авторизацію Steam.",
    logoutConfirmTitle: "Ви точно хочете вийти?",
    cancel: "Скасувати",
    logout: "Вийти",
    changingLanguage: "Змінюємо мову",
    footer: "Усі права захищені.",
  },
};

const defaultTeamMembers = [
  { name: "AdminName", role: "Owner/Developer", avatar: "https://i.pravatar.cc/150?img=1" },
  { name: "Moderator1", role: "Moderator", avatar: "https://i.pravatar.cc/150?img=2" },
  { name: "Moderator2", role: "Support", avatar: "https://i.pravatar.cc/150?img=3" },
];

function Panel({ children, className = "", variant = "default" }) {
  const variants = {
    default: "border-white/[0.10] bg-[#111111]",
    feature: "border-white/[0.14] bg-[#151515] shadow-[0_16px_55px_rgba(0,0,0,0.45)]",
    soft: "border-white/[0.07] bg-[#0d0d0d]",
    hero: "border-white/[0.10] bg-[#101010]/88 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl",
    command: "border-white/[0.12] bg-[#f5f5f5] text-black shadow-[0_18px_55px_rgba(255,255,255,0.08)]",
  };
  return <div className={`rounded-2xl border ${variants[variant] || variants.default} ${className}`}>{children}</div>;
}

function VLogo({ className = "" }) {
  return (
    <img
      src="/logo.png"
      alt="VEXON"
      className={`${className} object-contain`}
      draggable="false"
    />
  );
}

function LoadingValue({ className = "" }) {
  return (
    <span className={`relative inline-flex h-3 w-24 overflow-hidden rounded-full bg-white/10 align-middle ${className}`}>
      <motion.span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/70" initial={{ x: "-120%" }} animate={{ x: "360%" }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} />
    </span>
  );
}

function formatTimeLeft(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  const d = Math.floor(safe / 86400);
  const h = Math.floor((safe % 86400) / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatWipeDate(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function normalizeWipeType(type) {
  if (type === "full") return "FULL WIPE";
  if (type === "ordinary") return "ORDINARY WIPE";
  return "WIPE";
}

function formatPlaytime(value) {
  const minutes = Number(value || 0);
  if (!minutes || Number.isNaN(minutes)) return "0m";
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${mins}m`);
  return parts.join(" ");
}

function useServerStatus() {
  const [status, setStatus] = useState({
    loading: true,
    players: 0,
    maxPlayers: 150,
    serverOnline: false,
    map: "—",
    mapSize: 3750,
    wipeType: "ordinary",
    wipeAt: null,
    secondsLeft: null,
    timezone: "—",
    voteActive: false,
    fetchedAt: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [wipeResponse, serverResponse] = await Promise.allSettled([
          fetch(`/api/wipe?t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json()),
          fetch(`/api/server?t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json()),
        ]);
        const wipe = wipeResponse.status === "fulfilled" ? wipeResponse.value : null;
        const server = serverResponse.status === "fulfilled" ? serverResponse.value : null;
        setStatus((prev) => ({
          ...prev,
          players: Number(server?.players ?? prev.players ?? 0),
          maxPlayers: Number(server?.maxPlayers ?? prev.maxPlayers ?? 150),
          serverOnline: Boolean(server?.online ?? prev.serverOnline),
          map: server?.map || prev.map,
          mapSize: Number(server?.mapSize ?? prev.mapSize ?? 3750),
          wipeType: wipe?.wipe_type || prev.wipeType,
          wipeAt: wipe?.wipe_at || prev.wipeAt,
          secondsLeft: Number.isFinite(Number(wipe?.seconds_left)) ? Number(wipe.seconds_left) : prev.secondsLeft,
          timezone: wipe?.timezone || prev.timezone,
          voteActive: Boolean(wipe?.vote_active),
          fetchedAt: Date.now(),
          loading: false,
        }));
      } catch {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };
    load();
    const interval = window.setInterval(load, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const wipeSeconds = 3 * 24 * 60 * 60;
  const serverLeft = typeof status.secondsLeft === "number" ? status.secondsLeft : wipeSeconds;
  const localElapsed = status.fetchedAt ? Math.floor((Date.now() - status.fetchedAt) / 1000) : 0;
  const left = Math.max(serverLeft - localElapsed, 0);
  const wipePercent = Math.max(0, Math.min(100, ((wipeSeconds - left) / wipeSeconds) * 100));
  const wipeDay = Math.max(1, Math.min(3, Math.floor((wipeSeconds - left) / 86400) + 1));
  const onlinePercent = Math.max(0, Math.min(100, (status.players / status.maxPlayers) * 100));

  return {
    ...status,
    timeLeft: formatTimeLeft(left),
    onlinePercent,
    wipePercent,
    wipeDay,
    wipeLabel: normalizeWipeType(status.wipeType),
    wipeDateLabel: formatWipeDate(status.wipeAt),
  };
}

function useEditableTeam(steamUser) {
  const [members, setMembers] = useState(defaultTeamMembers);
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    try {
      const response = await fetch(`/api/team?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      setMembers(Array.isArray(data.members) && data.members.length ? data.members : defaultTeamMembers);
    } catch {
      setMembers(defaultTeamMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const saveTeam = async (nextMembers) => {
    setMembers(nextMembers);
    const response = await fetch("/api/team/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steamid: steamUser?.steamid, members: nextMembers }),
    });
    if (!response.ok) {
      await loadMembers();
      alert("Save failed. Check admin access or API logs.");
    }
  };

  const updateMember = (index, patch) => saveTeam(members.map((member, i) => (i === index ? { ...member, ...patch } : member)));
  const addMember = () => saveTeam([...members, { name: "New Admin", role: "Support", avatar: "https://i.pravatar.cc/150?img=12" }]);
  const removeMember = (index) => {
    if (members.length <= 1) {
      alert("You need at least one team member.");
      return;
    }
    if (!window.confirm(`Delete ${members[index]?.name || "this member"}?`)) return;
    saveTeam(members.filter((_, i) => i !== index));
  };

  return { members, updateMember, addMember, removeMember, loading };
}

function usePlayerStats(steamUser) {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!steamUser?.steamid) return undefined;
    let cancelled = false;
    const fallback = { nickname: steamUser.name || "STEAM_PLAYER", avatar: steamUser.avatar || "", steamId: steamUser.steamid, playtime: "0", kills: 0, deaths: 0, kd: "0.00" };
    const loadStats = () => {
      fetch(`/api/vexon/player/stats?steamid=${steamUser.steamid}&t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (!data || data.error) {
            setPlayer(fallback);
            return;
          }
          const kills = Number(data.kills || 0);
          const deaths = Number(data.deaths || 0);
          setPlayer({
            nickname: data.nickname || fallback.nickname,
            avatar: data.avatar && data.avatar !== "EMPTY" ? data.avatar : fallback.avatar,
            steamId: data.steamid || fallback.steamId,
            playtime: data.playtime || "0",
            kills,
            deaths,
            kd: deaths > 0 ? (kills / deaths).toFixed(2) : kills > 0 ? kills.toFixed(2) : "0.00",
          });
        })
        .catch(() => {
          if (!cancelled) setPlayer(fallback);
        });
    };
    loadStats();
    const interval = window.setInterval(loadStats, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [steamUser]);

  return { player };
}

function Button({ children, href, onClick, variant = "primary" }) {
  const base = "inline-flex min-h-[46px] items-center justify-center rounded-md px-4 text-xs font-black transition duration-300 sm:min-h-[54px] sm:px-7 sm:text-sm";
  const classes = variant === "primary" ? "bg-white text-black hover:-translate-y-1 hover:bg-zinc-200" : "border border-white/10 bg-white/[0.04] text-zinc-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]";
  if (href) return <a href={href} className={`${base} ${classes}`}>{children}</a>;
  return <button type="button" onClick={onClick} className={`${base} ${classes}`}>{children}</button>;
}

function LanguageMenu({ language, onLanguageChange }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const current = languages.find((item) => item.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-11 cursor-pointer items-center gap-1 rounded-lg px-2 text-[10px] font-black text-zinc-200 transition hover:bg-white/[0.08] hover:text-white sm:h-10 sm:gap-2 sm:px-3 sm:text-xs">
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#111111] p-1 shadow-2xl">
          {languages.map((item) => (
            <button key={item.code} type="button" onClick={() => { onLanguageChange(item.code); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-black transition ${item.code === language ? "bg-white text-black" : "text-zinc-400 hover:bg-white/10 hover:text-white"}`}>
              <span>{item.flag}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountMenu({ t, steamUser, walletBalance = 0, onLogoutConfirm, openProfile, openSettings, openInventory, navItems = [], onHome }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const fallbackAvatar = "https://api.dicebear.com/7.x/identicon/svg?seed=VEXON_PLAYER&backgroundColor=111113&radius=12";
  const avatar = steamUser?.avatar || fallbackAvatar;

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const itemClass = (delay) => `w-full px-4 py-3 text-left text-sm font-black text-zinc-300 transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06] ${
    open ? `translate-y-0 opacity-100 ${delay}` : "translate-y-2 opacity-0 delay-0"
  }`;

  return (
    <div className="relative block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="hidden h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg transition hover:bg-white/[0.08] md:flex"
      >
        <img src={avatar} alt="Steam avatar" className="h-8 w-8 rounded-md object-cover" />
      </button>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-white/[0.08] md:hidden"
        aria-label="Open menu"
      >
        <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "opacity-0" : "opacity-100"}`} />
        <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      <div className={`absolute right-0 z-50 mt-3 w-72 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-[0_18px_70px_rgba(0,0,0,0.55)] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        open ? "translate-y-0 scale-100 opacity-100 blur-0" : "pointer-events-none -translate-y-1 scale-[0.985] opacity-0 blur-[2px]"
      }`}>
        <div className={`border-b border-white/10 p-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-y-0 opacity-100 delay-[40ms]" : "translate-y-2 opacity-0 delay-0"}`}>
          <div className="flex items-center gap-3">
            <img src={avatar} alt="Steam avatar" className="h-11 w-11 rounded-lg object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-black text-white">{steamUser?.name || "STEAM"}</div>
              <div className="mt-1 flex items-center gap-2 truncate font-mono text-[10px] text-zinc-500">
                <span className="truncate">{steamUser?.steamid || "VEXON"}</span>
                <span className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-black text-zinc-300">{t.profileBalance || "Balance"} {walletBalance}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 py-2 md:hidden">
          {navItems.map(([label, href]) => (
            <button
              key={href}
              type="button"
              onClick={() => {
                setOpen(false);
                onHome?.(href);
              }}
              className="w-full px-4 py-3 text-left text-sm font-black text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>

        <button type="button" onClick={() => { setOpen(false); openProfile(); }} className={itemClass("delay-[70ms]")}>{t.profileMenuProfile || "My Profile"}</button>
        <button type="button" onClick={() => { setOpen(false); openInventory?.(); }} className={itemClass("delay-[145ms]")}>{t.profileMenuInventory || "Inventory"}</button>
        <button type="button" onClick={() => { setOpen(false); openSettings(); }} className={itemClass("delay-[170ms]")}>{t.profileMenuSettings || "Settings"}</button>
        <div className={`h-px bg-white/10 transition-opacity duration-500 ${open ? "opacity-100 delay-[220ms]" : "opacity-0 delay-0"}`} />
        <button type="button" onClick={() => { setOpen(false); onLogoutConfirm(); }} className={`w-full px-4 py-3 text-left text-sm font-black text-red-400 transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06] ${open ? "translate-y-0 opacity-100 delay-[240ms]" : "translate-y-2 opacity-0 delay-0"}`}>{t.profileMenuLogout || "Logout"}</button>
      </div>
    </div>
  );
}


function GuestMenu({ t, onSteamLogin, navItems = [], onHome }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative sm:hidden" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-white/[0.08]"
        aria-label="Open menu"
      >
        <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "opacity-0" : "opacity-100"}`} />
        <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      <div className={`absolute right-0 z-50 mt-3 w-72 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-[0_18px_70px_rgba(0,0,0,0.55)] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        open ? "translate-y-0 scale-100 opacity-100 blur-0" : "pointer-events-none -translate-y-1 scale-[0.985] opacity-0 blur-[2px]"
      }`}>
        <div className="border-b border-white/10 p-3">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSteamLogin();
            }}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
          >
            {t.steam}
          </button>
        </div>

        <div className="py-2">
          {navItems.map(([label, href]) => (
            <button
              key={href}
              type="button"
              onClick={() => {
                setOpen(false);
                onHome?.(href);
              }}
              className="w-full px-4 py-3 text-left text-sm font-black text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({ page, onHome, language, onLanguageChange, t, isAuthenticated, steamUser, walletBalance = 0, onLogoutConfirm, openProfile, openSettings, openInventory, onSteamLogin, cartItems = [], setCartOpen, cartBounce }) {
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const navLockRef = useRef(null);

  const goToSection = (event, href, index) => {
    event.preventDefault();

    if (navLockRef.current) {
      window.clearTimeout(navLockRef.current);
    }

    setActiveNavIndex(index);
    onHome(href);

    navLockRef.current = window.setTimeout(() => {
      navLockRef.current = null;
    }, 950);
  };

  useEffect(() => {
    if (page !== "home") return;

    const sections = t.nav
      .map(([, href], index) => {
        const element = document.querySelector(href);
        return element ? { element, index } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible || navLockRef.current) return;

        const current = sections.find((section) => section.element === visible.target);
        if (current) setActiveNavIndex(current.index);
      },
      {
        root: null,
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0.08, 0.2, 0.4, 0.65],
      }
    );

    sections.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, [page, t.nav]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-black/55 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:h-[78px] sm:px-6">
        <button type="button" onClick={(event) => goToSection(event, "#home", 0)} className="group flex min-w-0 items-center gap-2 text-left sm:gap-3">
          <VLogo className="h-9 w-9 transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_28px_rgba(120,255,240,0.85)] group-hover:brightness-125 sm:h-11 sm:w-11" />
          <div>
            <div className="text-base font-black leading-none tracking-[0.18em] sm:text-xl">VEXON</div>
            <div className="mt-0.5 text-[8px] font-black tracking-[0.38em] text-zinc-500 sm:mt-1 sm:text-[10px] sm:tracking-[0.44em]">RUST</div>
          </div>
        </button>
        <nav className={`relative hidden items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex ${page === "home" ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none -translate-y-10 opacity-0 blur-sm"}`}>
          <div className="relative flex items-center rounded-xl bg-white/[0.02] p-1">
            <span className="absolute bottom-1 left-1 top-1 w-[88px] rounded-lg bg-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.08)] transition-transform duration-300 ease-out" style={{ transform: `translateX(${activeNavIndex * 88}px)` }} />
            {t.nav.map(([label, href], index) => (
              <a key={href} href={href} onClick={(event) => goToSection(event, href, index)} className={`relative z-10 w-[88px] rounded-lg py-3 text-center text-xs font-black transition-colors duration-300 ${activeNavIndex === index ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>{label}</a>
            ))}
          </div>
        </nav>
        <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.025] p-1 shadow-[0_16px_44px_rgba(0,0,0,0.22)] sm:gap-1">
          <LanguageMenu language={language} onLanguageChange={onLanguageChange} />
          {page === "home" && (
            <motion.button
              type="button"
              onClick={() => setCartOpen?.(true)}
              className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition hover:bg-white/[0.08] ${
                cartBounce ? "scale-110 border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_26px_rgba(120,255,240,0.28)]" : "scale-100"
              }`}
              animate={cartBounce ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              aria-label="Open cart"
            >
              <motion.span
                animate={cartBounce ? { rotate: [0, -12, 12, -8, 0], scale: [1, 1.22, 1] } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="text-base"
              >
                🛒
              </motion.span>
              {cartItems.length > 0 && (
                <motion.span
                  key={cartItems.length}
                  initial={{ y: -5, opacity: 0, scale: 0.7 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-black"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </motion.button>
          )}
          {isAuthenticated ? (
            <AccountMenu t={t} steamUser={steamUser} walletBalance={walletBalance} onLogoutConfirm={onLogoutConfirm} openProfile={openProfile} openSettings={openSettings} openInventory={openInventory} navItems={t.nav} onHome={onHome} />
          ) : (
            <>
              <button type="button" onClick={onSteamLogin} className="hidden h-10 cursor-pointer items-center rounded-lg px-3 text-[10px] font-black text-zinc-200 transition hover:bg-white/[0.08] hover:text-white sm:flex sm:px-4 sm:text-xs">{t.steam}</button>
              <GuestMenu t={t} onSteamLogin={onSteamLogin} navItems={t.nav} onHome={onHome} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-12">
      <div className="text-[9px] font-black uppercase tracking-[0.28em] text-zinc-500 sm:text-[11px] sm:tracking-[0.34em]">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:mt-3 sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-sm leading-6 text-zinc-400 sm:mt-4 sm:text-base">{text}</p>}
    </div>
  );
}

function StatCard({ label, value, loading, isStatus = false, online = false }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">{label}</div>
      <div className="mt-2 flex min-h-[28px] items-center gap-2 text-lg font-black text-white sm:text-xl">
        {loading ? <LoadingValue className="w-20 sm:w-28" /> : <>{isStatus && <span className={`h-3 w-3 rounded-full ${online ? "bg-green-400 shadow-[0_0_18px_rgba(74,222,128,0.8)]" : "bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.7)]"}`} />}<span className="truncate">{value}</span></>}
      </div>
    </div>
  );
}

function HomePage({ t, copied, copyIp, steamUser, editorMode, cartItems, setCartItems, setCartOpen, setCartBounce, cartOpen, setCheckoutPreparing, walletBalance, refreshWallet, refreshInventory, openPublicProfile }) {
  const serverData = useServerStatus();
  const isTeamAdmin = ADMIN_STEAM_IDS.includes(String(steamUser?.steamid || ""));
  return (
    <>
      <section id="home" className="relative flex min-h-[82vh] items-center justify-center px-4 pt-16 text-center sm:min-h-screen sm:pt-[78px]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="relative max-w-4xl">
          <div className="mb-5 text-[10px] font-semibold uppercase tracking-[0.36em] text-zinc-500">2X · 3 DAY WIPE · EU</div>
          <h1 className="text-[2.5rem] font-extrabold leading-[0.9] tracking-[-0.04em] text-white sm:text-[5rem] lg:text-[6.8rem]" style={{ fontFamily: "'RustUI', sans-serif" }}>VEXON<span className="block text-zinc-500">RUST</span></h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-zinc-400 sm:mt-6 sm:max-w-xl sm:text-base sm:leading-7">{t.heroText}</p>
        </motion.div>
      </section>
      <ServerInfoSection t={t} copied={copied} copyIp={copyIp} data={serverData} />
      <FeaturesSection t={t} />
      <PlayersSection t={t} onOpenPlayerProfile={openPublicProfile} />
      <ShopSection t={t} isAdmin={isTeamAdmin && editorMode} steamUser={steamUser} cartItems={cartItems} setCartItems={setCartItems} setCartOpen={setCartOpen} setCartBounce={setCartBounce} cartOpen={cartOpen} setCheckoutPreparing={setCheckoutPreparing} walletBalance={walletBalance} refreshWallet={refreshWallet} refreshInventory={refreshInventory} />
      <TeamSection isAdmin={isTeamAdmin && editorMode} steamUser={steamUser} t={t} />
      <ConnectSection t={t} />
      <RulesSection t={t} />
    </>
  );
}

function ServerInfoSection({ t, copied, copyIp, data }) {
  const { loading, players, maxPlayers, onlinePercent, wipePercent, wipeDay, wipeLabel, wipeDateLabel, timeLeft, timezone, voteActive, serverOnline, map, mapSize } = data;
  return (
    <section id="server-info" className="mx-auto grid min-h-screen max-w-5xl scroll-mt-24 items-center gap-3 px-4 py-8 sm:px-6 sm:py-12 md:grid-cols-2 lg:items-stretch">
      <Panel className="flex flex-col justify-between p-4 sm:p-5 lg:min-h-[520px] lg:p-7">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.34em] text-zinc-500">{t.serverInfoEyebrow}</div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl lg:text-5xl" style={{ fontFamily: "'RustUI', sans-serif" }}>VEXON RUST</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400 sm:mt-4 sm:text-base sm:leading-7">{t.serverDescription}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
            <StatCard label={t.status} loading={false} value={loading ? t.loading.toUpperCase() : serverOnline ? t.online.toUpperCase() : t.offline.toUpperCase()} online={serverOnline} isStatus />
            <StatCard label={t.players} loading={loading} value={`${players} / ${maxPlayers}`} />
            <StatCard label={t.map} loading={loading} value={map} />
            <StatCard label={t.mapSize} loading={loading} value={mapSize} />
          </div>
        </div>
        <div>
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-xs font-black uppercase tracking-[0.22em] text-zinc-500"><span>{t.online}</span><span>{loading ? <LoadingValue className="h-2 w-20" /> : `${players} / ${maxPlayers}`}</span></div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: `${onlinePercent}%` }} transition={{ duration: 0.8, ease: "easeOut" }} /></div>
          </div>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/35 p-3 font-mono text-xs text-zinc-300 sm:mt-6 sm:p-4 sm:text-sm">connect {serverIp}</div>
          <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3"><Button onClick={copyIp}>{copied ? t.copied : t.copy}</Button><Button href={discordUrl} variant="secondary">{t.discord}</Button></div>
        </div>
      </Panel>
      <div className="grid gap-3 lg:min-h-[520px]">
        <Panel variant="command" className="relative overflow-hidden p-4 sm:p-5 lg:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div><div className="text-[11px] font-black uppercase tracking-[0.34em] text-black/45">{t.nextWipe}</div><h3 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{timeLeft}</h3><p className="mt-3 max-w-md text-sm leading-6 text-black/55 sm:mt-4 sm:text-base sm:leading-7">{wipeLabel} • {wipeDateLabel} • {timezone}</p></div>
            <div className="mt-7 sm:mt-10"><div className="mb-3 flex items-center justify-between text-xs font-black uppercase tracking-[0.22em] text-black/45"><span>{t.cycleProgress}</span><span>{t.day} {wipeDay} / 3</span></div><div className="h-3 overflow-hidden rounded-full bg-black/15"><div className="h-full rounded-full bg-black" style={{ width: `${wipePercent}%` }} /></div></div>
          </div>
        </Panel>
        <Panel className="flex flex-col justify-between p-4 sm:p-5 lg:p-6">
          <div><div className="text-[11px] font-black uppercase tracking-[0.34em] text-zinc-500">{t.serverNote}</div><h3 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.serverNoteTitle}</h3><p className="mt-4 max-w-md text-sm leading-6 text-zinc-400 sm:mt-5 sm:leading-7">{t.serverNoteText}</p></div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8"><StatCard label={t.vote} loading={false} value={voteActive ? t.active.toUpperCase() : t.off.toUpperCase()} /><StatCard label={t.type} loading={false} value={wipeLabel} /></div>
        </Panel>
      </div>
    </section>
  );
}

function FeaturesSection({ t }) {
  return (
    <section id="features" className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 grid gap-4 sm:mb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"><div><div className="text-[11px] font-black uppercase tracking-[0.34em] text-zinc-500">Features</div><h2 className="mt-3 max-w-xl text-2xl font-black tracking-[-0.03em] sm:text-3xl lg:text-4xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.featuresTitle}</h2></div><p className="max-w-2xl text-sm leading-6 text-zinc-400 lg:justify-self-end">{t.featuresText}</p></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12">
        {t.features.map(([title, text], index) => {
          const isLarge = index === 0 || index === 1 || index === 5 || index === 6;
          const panelClass = isLarge ? "p-3 sm:p-4 md:col-span-2 lg:col-span-6" : "p-3 sm:p-4 md:col-span-1 lg:col-span-4";
          return <Panel key={title} variant={index === 2 ? "command" : "feature"} className={`${panelClass} group relative overflow-hidden transition hover:-translate-y-1`}><div className="relative"><div className={`${index === 2 ? "bg-black/20" : "bg-white/20"} mb-5 h-1 w-12 rounded-full sm:mb-7 sm:w-16`} /><h3 style={{ fontFamily: "'RustUI', sans-serif" }} className={`${isLarge ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl"} font-black tracking-[-0.03em]`}>{title}</h3><p className={`${index === 2 ? "text-black/60" : "text-zinc-400"} mt-3 max-w-md text-xs leading-5 sm:mt-5 sm:text-sm sm:leading-7`}>{text}</p></div></Panel>;
        })}
      </div>
    </section>
  );
}


function formatShopPrice(item) {
  return `${item.currency || "$"}${Number(item.price || 0).toFixed(2)}`;
}

function createShopItem(t, language = "en") {
  const name = t.shopNewItemName || "NEW ITEM";
  const tag = t.shopNewItemTag || "NEW";
  const perks = [t.shopNewPerk || "New perk", t.shopEditableItem || "Editable item"];

  return normalizeShopItem({
    id: `item_${Date.now()}`,
    category: "vip",
    price: 1.99,
    currency: "$",
    popular: false,
    translations: SHOP_LANGUAGES.reduce((acc, { code }) => {
      acc[code] = { name, tag, perks };
      return acc;
    }, {}),
  }, language);
}

const SHOP_ITEMS_STORAGE_KEY = "vexon_shop_items_v3";
const SHOP_LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uk", label: "UK" },
];

function inferLanguageFromContent(t) {
  if (t?.steam === "Войти") return "ru";
  if (t?.steam === "Увійти") return "uk";
  return "en";
}

function cloneShopItems(items) {
  return JSON.parse(JSON.stringify(items || []));
}

function toTranslationShape(value, fallback = {}) {
  return {
    name: value?.name ?? fallback.name ?? "NEW ITEM",
    tag: value?.tag ?? fallback.tag ?? "NEW",
    perks: Array.isArray(value?.perks) ? value.perks : Array.isArray(fallback.perks) ? fallback.perks : [],
  };
}

function normalizeShopItem(item, language = "en") {
  const legacyText = {
    name: item?.name || "NEW ITEM",
    tag: item?.tag || "NEW",
    perks: Array.isArray(item?.perks) ? item.perks : [],
  };

  const translations = { ...(item?.translations || {}) };

  if (!translations.en) translations.en = toTranslationShape(legacyText);
  SHOP_LANGUAGES.forEach(({ code }) => {
    if (!translations[code]) {
      translations[code] = toTranslationShape(translations.en || legacyText);
    }
  });

  if (language && !translations[language]) {
    translations[language] = toTranslationShape(translations.en || legacyText);
  }

  return {
    id: item?.id || `item_${Date.now()}`,
    category: item?.category || "vip",
    price: Number(item?.price || 0),
    currency: item?.currency || "$",
    popular: Boolean(item?.popular),
    translations,
  };
}

function makeLocalizedShopDefaults() {
  const byId = new Map();

  SHOP_LANGUAGES.forEach(({ code }) => {
    (content?.[code]?.shopItems || []).forEach((item) => {
      const current = byId.get(item.id) || {
        id: item.id,
        category: item.category || "vip",
        price: Number(item.price || 0),
        currency: item.currency || "$",
        popular: Boolean(item.popular),
        translations: {},
      };

      current.category = item.category || current.category;
      current.price = Number(item.price || current.price || 0);
      current.currency = item.currency || current.currency || "$";
      current.popular = Boolean(item.popular);
      current.translations[code] = toTranslationShape(item);

      byId.set(item.id, current);
    });
  });

  return Array.from(byId.values()).map((item) => normalizeShopItem(item, "en"));
}

function mergeDefaultAndStoredShopItems(storedItems) {
  const defaults = makeLocalizedShopDefaults();
  const stored = Array.isArray(storedItems) ? storedItems.map((item) => normalizeShopItem(item, "en")) : [];
  const merged = new Map(defaults.map((item) => [item.id, item]));

  stored.forEach((item) => {
    const existing = merged.get(item.id);
    merged.set(item.id, existing ? { ...existing, ...item, translations: { ...existing.translations, ...item.translations } } : item);
  });

  return Array.from(merged.values());
}

function loadShopItems() {
  try {
    const storedV3 = JSON.parse(localStorage.getItem(SHOP_ITEMS_STORAGE_KEY) || "null");
    if (Array.isArray(storedV3) && storedV3.length) return mergeDefaultAndStoredShopItems(storedV3);

    const storedV2 = JSON.parse(localStorage.getItem("vexon_shop_items_v2") || "null");
    if (Array.isArray(storedV2) && storedV2.length) return mergeDefaultAndStoredShopItems(storedV2);
  } catch {
    // ignore broken local storage
  }

  return mergeDefaultAndStoredShopItems([]);
}

function saveShopItems(items) {
  try {
    localStorage.setItem(SHOP_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage write errors
  }
}

function getShopText(item, language) {
  const normalized = normalizeShopItem(item, language || "en");
  return normalized.translations?.[language] || normalized.translations?.en || toTranslationShape();
}

function getShopPerks(item, language) {
  return getShopText(item, language).perks || [];
}

function updateShopTranslation(item, language, patch) {
  const normalized = normalizeShopItem(item, language);
  const currentText = getShopText(normalized, language);

  return {
    ...normalized,
    translations: {
      ...normalized.translations,
      [language]: {
        ...currentText,
        ...patch,
      },
    },
  };
}

function copyShopTranslationToAll(item, sourceLanguage) {
  const normalized = normalizeShopItem(item, sourceLanguage);
  const source = toTranslationShape(getShopText(normalized, sourceLanguage));

  return {
    ...normalized,
    translations: SHOP_LANGUAGES.reduce((acc, { code }) => {
      acc[code] = cloneShopItems(source);
      return acc;
    }, {}),
  };
}


function getShopCategoryAccent(category) {
  if (category === "kit") {
    return {
      badge: "border-purple-300/35 bg-purple-400/10 text-purple-200 shadow-[0_0_24px_rgba(192,132,252,0.20)]",
      dot: "bg-purple-300 shadow-[0_0_18px_rgba(192,132,252,0.8)]",
    };
  }

  if (category === "cosmetic") {
    return {
      badge: "border-pink-300/35 bg-pink-400/10 text-pink-200 shadow-[0_0_24px_rgba(244,114,182,0.20)]",
      dot: "bg-pink-300 shadow-[0_0_18px_rgba(244,114,182,0.8)]",
    };
  }

  return {
    badge: "border-cyan-300/35 bg-cyan-400/10 text-cyan-200 shadow-[0_0_24px_rgba(120,255,240,0.20)]",
    dot: "bg-cyan-300 shadow-[0_0_18px_rgba(120,255,240,0.8)]",
  };
}

function ShopSection({ t, isAdmin, steamUser, cartItems, setCartItems, setCartOpen, setCartBounce, cartOpen, setCheckoutPreparing, walletBalance = 0, refreshWallet, refreshInventory }) {
  const language = inferLanguageFromContent(t);
  const [items, setItems] = useState(loadShopItems);
  const [activeCategory, setActiveCategory] = useState("vip");
  const [editingItem, setEditingItem] = useState(null);
  const [expandedPerks, setExpandedPerks] = useState(() => new Set());
  const shopCategories = t.shopCategories || [
    { id: "vip", label: "VIP" },
    { id: "kit", label: "KIT" },
    { id: "cosmetic", label: "COSMETIC" },
  ];

  const buyer = steamUser || {
    name: "STEAM_PLAYER",
    steamid: "7656119XXXXXXXXXX",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=VEXON_PLAYER&backgroundColor=111113&radius=12",
  };

  useEffect(() => {
    saveShopItems(items);
  }, [items]);

  const visibleItems = useMemo(
    () => items.filter((item) => (item.category || "vip") === activeCategory),
    [items, activeCategory]
  );

  const togglePerks = (itemId) => {
    setExpandedPerks((current) => {
      const next = new Set(current);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const total = useMemo(() => {
    const sum = cartItems.reduce((acc, item) => acc + Number(item.price || 0), 0);
    return `$${sum.toFixed(2)}`;
  }, [cartItems]);

  const coinTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + Math.max(1, Math.round(Number(item.price || 0) * 100)), 0);
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setCartBounce(true);
    window.setTimeout(() => setCartBounce(false), 450);
    setCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => setCartItems([]);

  const addItem = () => {
    const item = createShopItem(t, language);
    setItems((current) => [item, ...current]);
    setEditingItem(item);
    setActiveCategory(item.category);
  };

  const updateItem = (id, patch) => {
    setItems((current) => current.map((item) => (item.id === id ? normalizeShopItem({ ...item, ...patch }, language) : item)));
    setEditingItem((current) => (current?.id === id ? normalizeShopItem({ ...current, ...patch }, language) : current));
    setCartItems((current) => current.map((item) => (item.id === id ? normalizeShopItem({ ...item, ...patch }, language) : item)));
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setEditingItem((current) => (current?.id === id ? null : current));
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const updatePerk = (id, index, value, targetLanguage = language) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    const perks = [...getShopPerks(item, targetLanguage)];
    perks[index] = value;
    updateItem(id, updateShopTranslation(item, targetLanguage, { perks }));
  };

  const addPerk = (id, targetLanguage = language) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    updateItem(id, updateShopTranslation(item, targetLanguage, { perks: [...getShopPerks(item, targetLanguage), t.shopNewPerk || "New perk"] }));
  };

  const removePerk = (id, index, targetLanguage = language) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    updateItem(id, updateShopTranslation(item, targetLanguage, { perks: getShopPerks(item, targetLanguage).filter((_, perkIndex) => perkIndex !== index) }));
  };

  const checkout = async () => {
    if (!cartItems.length) return;

    if (!steamUser?.steamid) {
      alert(t.steam || "Sign in");
      return;
    }

    setCartOpen(false);
    setCheckoutPreparing?.(true);

    try {
      const response = await fetch("/api/vexon?action=create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: 1,
          })),
          steamId: steamUser.steamid,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Stripe checkout error:", error);
      alert(error?.message || "Checkout failed");
      setCheckoutPreparing?.(false);
    }
  };

  const coinCheckout = async () => {
    if (!cartItems.length) return;

    if (!steamUser?.steamid) {
      alert(t.steam || "Sign in");
      return;
    }

    if (walletBalance < coinTotal) {
      alert(t.shopCoinsNotEnough || "Not enough Vexon Coins.");
      return;
    }

    setCartOpen(false);

    try {
      const response = await fetch("/api/vexon?action=purchase-with-coins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: 1,
          })),
          steamId: steamUser.steamid,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Coin checkout failed");
      }

      setCartItems([]);
      await refreshWallet?.();
      await refreshInventory?.();
      alert(t.shopCoinsSuccess || "Purchase completed with Vexon Coins.");
    } catch (error) {
      console.error("Vexon Coins checkout error:", error);
      alert(error?.message || "Coin checkout failed");
    }
  };

  return (
    <section
      id="shop"
      className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 text-white sm:px-6 sm:py-20"
    >
      <div className="mb-12 text-center">
        <div className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500">SHOP</div>
        <h2 className="mt-4 text-5xl font-black tracking-tight" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.shopTitle}</h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-500">{t.shopText}</p>

        {isAdmin && (
          <button
            type="button"
            onClick={addItem}
            className="mt-7 cursor-pointer rounded-lg border border-white/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:-translate-y-1 hover:bg-zinc-200"
          >
            {t.shopAddItem}
          </button>
        )}
      </div>

      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-2">
          {shopCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`relative min-w-[106px] cursor-pointer rounded-lg px-4 py-3 text-xs font-black transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-white text-black shadow-[0_10px_34px_rgba(255,255,255,0.12)]"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
              }`}
            >
              {category.label}
              {activeCategory === category.id && (
                <span className="absolute inset-x-4 -bottom-1 h-px bg-cyan-300 shadow-[0_0_18px_rgba(120,255,240,0.9)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:justify-center sm:gap-5 md:grid-cols-[repeat(auto-fit,minmax(260px,320px))]">
        {visibleItems.map((item, index) => {
          const perks = getShopPerks(item, language);
          const isExpanded = expandedPerks.has(item.id);
          const shownPerks = isExpanded ? perks : perks.slice(0, 3);
          const hiddenPerks = Math.max(0, perks.length - shownPerks.length);
          const accent = getShopCategoryAccent(item.category);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.42, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-2xl border bg-[linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.018))] p-3 shadow-[0_18px_70px_rgba(0,0,0,0.32)] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055] sm:p-5 ${
                item.popular ? item.category === "kit" ? "border-purple-300/25" : item.category === "cosmetic" ? "border-pink-300/25" : "border-cyan-300/25" : "border-white/10"
              }`}
            >
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-white/[0.055] blur-3xl transition group-hover:bg-white/[0.08]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              {isAdmin && (
                <div className="absolute right-3 top-3 z-20 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="cursor-pointer rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-black"
                  >
                    {t.shopEdit}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="cursor-pointer rounded-lg border border-red-400/20 bg-red-500/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-200 backdrop-blur transition hover:bg-red-500 hover:text-white"
                  >
                    {t.shopDelete}
                  </button>
                </div>
              )}

              <div className="relative z-10 flex items-start justify-between gap-3">
                <span className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
                  {getShopText(item, language).tag}
                </span>

                {item.popular && (
                  <motion.span
                    className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.08em] backdrop-blur sm:px-2 sm:py-1 sm:text-[9px] ${accent.badge}`}
                    initial={{ opacity: 0, y: -8, x: 8, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                    {t.shopFeatured}
                  </motion.span>
                )}
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="line-clamp-2 min-h-[2.15em] text-lg font-black leading-[1.08] tracking-[-0.04em] text-white sm:text-2xl">
                  {getShopText(item, language).name}
                </h3>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="vexon-number text-2xl font-black tracking-[-0.05em] text-white sm:text-4xl">{formatShopPrice(item)}</div>
                    <div className="vexon-number mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-300/80 sm:text-xs">
                      {Math.max(1, Math.round(Number(item.price || 0) * 100))} {t.shopCoinsPrice || "V-Coins"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <div className="grid gap-1.5">
                  {shownPerks.map((perk) => (
                    <div key={perk} className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-2 py-1.5 text-[10px] leading-4 text-zinc-300">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                      <span className="min-w-0 truncate">{perk}</span>
                    </div>
                  ))}
                </div>

                {perks.length > 3 && (
                  <button
                    type="button"
                    onClick={() => togglePerks(item.id)}
                    className="mt-2 min-h-9 w-full rounded-lg border border-white/10 bg-white/[0.035] px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    {isExpanded ? (t.shopShowLess || "Show less") : `+${hiddenPerks} ${t.shopShowMore || "more"}`}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => addToCart(item)}
                className="relative z-10 mt-4 min-h-11 w-full cursor-pointer rounded-xl bg-white px-3 py-2 text-xs font-black text-black shadow-[0_10px_30px_rgba(255,255,255,0.12)] transition hover:bg-zinc-200 sm:mt-5 sm:text-sm"
              >
                {t.shopAddToCart}
              </button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {editingItem && (
          <ShopEditorDrawer
            t={t}
            item={editingItem}
            language={language}
            categories={shopCategories}
            onClose={() => setEditingItem(null)}
            onUpdate={updateItem}
            onAddPerk={addPerk}
            onUpdatePerk={updatePerk}
            onRemovePerk={removePerk}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <ShopCartDrawer
            t={t}
            buyer={buyer}
            language={language}
            cartItems={cartItems}
            total={total}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onClear={clearCart}
            onCheckout={checkout}
            onCoinCheckout={coinCheckout}
            coinTotal={coinTotal}
            walletBalance={walletBalance}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ShopTextInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="grid gap-2">
      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white outline-none transition focus:border-cyan-300/30"
      />
    </label>
  );
}

function ShopEditorDrawer({ t, item, language, categories, onClose, onUpdate, onAddPerk, onUpdatePerk, onRemovePerk }) {
  const [editLanguage, setEditLanguage] = useState(language || "en");
  const safeItem = item || {
    id: "",
    name: "",
    price: 0,
    currency: "$",
    tag: "",
    category: "vip",
    popular: false,
    perks: [],
  };

  const normalizedItem = normalizeShopItem(safeItem, editLanguage);
  const safeText = getShopText(normalizedItem, editLanguage);
  const safePerks = Array.isArray(safeText.perks) ? safeText.perks : [];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal((
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 px-4 py-8 text-white backdrop-blur-md">
      <button
        type="button"
        aria-label="Close editor"
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      <motion.div
        className="relative z-[100000] flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-white/10 bg-[#121212] text-white shadow-[0_30px_120px_rgba(0,0,0,0.85)]"
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.34em] text-zinc-600">
              {t.shopAdmin || "Admin"}
            </div>
            <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
              {t.shopEditItem || "Edit item"}
            </h3>
            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300/80">Editing: {editLanguage.toUpperCase()}</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-black text-zinc-300 transition hover:bg-white/[0.1] hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="border-b border-white/10 px-5 py-4">
          <div className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">Translation</div>
          <div className="flex flex-wrap gap-2">
            {SHOP_LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setEditLanguage(item.code)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-black transition ${
                  editLanguage === item.code ? "bg-white text-black" : "bg-white/[0.05] text-zinc-400 hover:bg-white/[0.09] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onUpdate(normalizedItem.id, copyShopTranslationToAll(normalizedItem, editLanguage))}
              className="ml-auto cursor-pointer rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-200 transition hover:bg-cyan-300/15"
            >
              Copy this language to all
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-4">
            <ShopTextInput
              label={t.shopName || "Name"}
              value={safeText.name}
              onChange={(value) => onUpdate(normalizedItem.id, updateShopTranslation(normalizedItem, editLanguage, { name: value }))}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <ShopTextInput
                label={t.shopPrice || "Price"}
                type="number"
                value={safeItem.price}
                onChange={(value) => onUpdate(normalizedItem.id, { price: Number(value) })}
              />
              <ShopTextInput
                label={t.shopCurrency || "Currency"}
                value={safeItem.currency}
                onChange={(value) => onUpdate(normalizedItem.id, { currency: value })}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ShopTextInput
                label={t.shopTag || "Tag"}
                value={safeText.tag}
                onChange={(value) => onUpdate(normalizedItem.id, updateShopTranslation(normalizedItem, editLanguage, { tag: value }))}
              />

              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                  {t.shopCategory || "Category"}
                </span>
                <select
                  value={safeItem.category || "vip"}
                  onChange={(event) => onUpdate(normalizedItem.id, { category: event.target.value })}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white outline-none transition focus:border-cyan-300/30"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-[#121212] text-white">
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="text-sm font-black text-white">
                {t.shopPopularItem || "Popular item"}
              </span>
              <button
                type="button"
                onClick={() => onUpdate(normalizedItem.id, { popular: !safeItem.popular })}
                className={`relative h-7 w-12 cursor-pointer rounded-full transition ${safeItem.popular ? "bg-cyan-300" : "bg-zinc-700"}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-black transition-transform ${safeItem.popular ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </label>

            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                  {t.shopPerks || "Perks"}
                </span>
                <button
                  type="button"
                  onClick={() => onAddPerk(normalizedItem.id, editLanguage)}
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300 transition hover:bg-white/[0.1] hover:text-white"
                >
                  {t.shopAddPerk || "+ Perk"}
                </button>
              </div>

              <div className="grid gap-2">
                {safePerks.map((perk, index) => (
                  <div key={`${normalizedItem.id}-${index}`} className="flex gap-2">
                    <input
                      value={perk}
                      onChange={(event) => onUpdatePerk(normalizedItem.id, index, event.target.value, editLanguage)}
                      className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-black text-white outline-none transition focus:border-cyan-300/30"
                    />
                    <button
                      type="button"
                      onClick={() => onRemovePerk(normalizedItem.id, index, editLanguage)}
                      className="cursor-pointer rounded-lg border border-red-400/20 bg-red-500/10 px-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 p-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-lg bg-white py-4 text-sm font-black text-black transition hover:bg-zinc-200"
          >
            {t.shopSaveChanges || "Save changes"}
          </button>
        </div>
      </motion.div>
    </div>
  ), document.body);
}

function ShopCartDrawer({ t, buyer, language, cartItems, total, onClose, onRemove, onClear, onCheckout, onCoinCheckout, coinTotal = 0, walletBalance = 0 }) {
  const safeBuyer = buyer || {};
  const items = Array.isArray(cartItems) ? cartItems : [];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 px-4 py-8 text-white backdrop-blur-md">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      <motion.div
        className="relative z-[100000] flex max-h-[86vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-white/10 bg-[#121212] text-white shadow-[0_30px_120px_rgba(0,0,0,0.85)]"
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.34em] text-zinc-600">
              {t?.shopCart || "Cart"}
            </div>
            <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
              {t?.shopCheckout || "Checkout"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-black text-zinc-300 transition hover:bg-white/[0.1] hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <img
              src={safeBuyer.avatar || "https://api.dicebear.com/7.x/identicon/svg?seed=VEXON_PLAYER&backgroundColor=111113&radius=12"}
              alt="Steam avatar"
              className="h-11 w-11 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-black text-white">{safeBuyer.name || "STEAM_PLAYER"}</div>
              <div className="truncate font-mono text-[10px] text-zinc-500">{safeBuyer.steamid || "7656119XXXXXXXXXX"}</div>
            </div>
          </div>

          {items.length ? (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-black text-white">{getShopText(item, language).name}</div>
                      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">{getShopText(item, language).tag}</div>
                    </div>
                    <div className="shrink-0 text-sm font-black text-white">{formatShopPrice ? formatShopPrice(item) : `${item.currency || "$"}${Number(item.price || 0).toFixed(2)}`}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="mt-3 cursor-pointer text-[10px] font-black uppercase tracking-[0.18em] text-red-300 transition hover:text-red-200"
                  >
                    {t?.shopRemove || "Remove"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-500">
              {t?.shopEmpty || "Cart is empty."}
            </div>
          )}

          <div className="mt-4 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-xs leading-6 text-cyan-100/80">
            {t?.shopDeliveryNote || "Purchase will be delivered to the Steam account shown above. Make sure you are signed into the correct account before checkout."}
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-[0.24em] text-zinc-500">{t?.shopTotal || "Total"}</span>
            <div className="text-right">
              <span className="block text-3xl font-black text-white">{total}</span>
              <span className="mt-1 block text-xs font-black uppercase tracking-[0.16em] text-cyan-300">{coinTotal} {t?.shopCoinsPrice || "V-Coins"}</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-zinc-500">{t?.shopCoinsBalance || "Balance"}: {walletBalance}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.8fr_1fr_1fr]">
            <button
              type="button"
              onClick={onClear}
              disabled={!items.length}
              className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] py-4 text-sm font-black text-zinc-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t?.shopClear || "Clear"}
            </button>

            <button
              type="button"
              onClick={onCoinCheckout}
              disabled={!items.length || walletBalance < coinTotal}
              className="cursor-pointer rounded-lg border border-cyan-300/25 bg-cyan-300/10 py-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t?.shopPayCoins || "Pay with Vexon Coins"}
            </button>

            <button
              type="button"
              onClick={onCheckout}
              disabled={!items.length}
              className="cursor-pointer rounded-lg bg-white py-4 text-sm font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t?.shopPayStripe || t?.shopCheckout || "Checkout"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}


function TeamSection({ isAdmin, steamUser, t }) {
  const { members, updateMember, addMember, removeMember, loading } = useEditableTeam(steamUser);
  const [openRoleIndex, setOpenRoleIndex] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".role-dropdown")) {
        setOpenRoleIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const editName = (index) => {
    const current = members[index]?.name || "";
    const next = window.prompt(t.nicknamePrompt, current);
    if (next !== null) updateMember(index, { name: next.trim() || current });
  };

  const editAvatar = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateMember(index, { avatar: String(reader.result || "") });
    reader.readAsDataURL(file);
  };

  return (
    <section id="team" className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.42em] text-zinc-600">Team</div>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">{t.teamTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:mt-4 sm:leading-7">
          {isAdmin ? t.teamAdminText : t.teamText}
        </p>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          {t.teamStory}
        </p>

        {isAdmin && (
          <button
            type="button"
            onClick={addMember}
            className="mt-7 rounded-xl border border-white/10 bg-white px-5 py-3 text-xs font-black text-black transition hover:-translate-y-1 hover:bg-zinc-200"
          >
            {t.addMember}
          </button>
        )}
      </div>

      <div className="mt-8 grid w-full grid-cols-3 items-start gap-x-2 gap-y-6 px-0 pb-3 sm:mt-12 sm:flex sm:flex-wrap sm:justify-center sm:gap-12 sm:px-0 sm:pb-0">
        {loading && (
          <div className="text-center text-sm font-black uppercase tracking-[0.24em] text-zinc-500">
            {t.loadingTeam}
          </div>
        )}

        {!loading && members.map((member, index) => {
          const memberRoles = getMemberRoles(member);
          const primaryRole = getPrimaryRole(member);
          const inputId = `team-avatar-${index}`;

          return (
            <div key={`${member.name}-${index}`} className={`group relative flex w-full min-w-0 flex-col items-center text-center transition duration-500 sm:w-[190px] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:scale-[1.035] ${primaryRole === "Owner" ? "hover:[filter:drop-shadow(0_24px_55px_rgba(255,70,70,0.18))]" : primaryRole === "Developer" ? "hover:[filter:drop-shadow(0_24px_55px_rgba(170,120,255,0.20))]" : primaryRole === "Helper" ? "hover:[filter:drop-shadow(0_24px_55px_rgba(120,255,140,0.18))]" : primaryRole === "Sponsor" ? "hover:[filter:drop-shadow(0_24px_65px_rgba(250,204,21,0.32))]" : "hover:[filter:drop-shadow(0_24px_55px_rgba(120,255,240,0.16))]"}`}>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  title={t.deleteMember}
                  className="absolute right-1 top-0 z-10 flex h-6 w-6 sm:right-8 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-xs font-black text-red-200 opacity-0 transition hover:bg-red-500/20 group-hover:opacity-100"
                >
                  ×
                </button>
              )}

              <div
                className={`pointer-events-none absolute top-6 h-20 w-20 sm:top-8 sm:h-32 sm:w-32 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-60 ${
                  primaryRole === "Owner"
                    ? "bg-red-500/45"
                    : primaryRole === "Co-Owner"
                    ? "bg-rose-400/42"
                    : primaryRole === "Developer"
                    ? "bg-purple-500/45"
                    : primaryRole === "Helper"
                    ? "bg-lime-400/38"
                    : primaryRole === "Sponsor"
                    ? "bg-yellow-300/45"
                    : "bg-cyan-400/35"
                }`}
              />

              <div
                className={`relative h-16 w-16 overflow-hidden sm:h-24 sm:w-24 rounded-full border border-white/10 bg-white/[0.035] p-1 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:border-white/30 group-hover:brightness-110 ${
                  primaryRole === "Owner"
                    ? "group-hover:shadow-[0_0_58px_rgba(255,70,70,0.72)]"
                    : primaryRole === "Co-Owner"
                    ? "group-hover:shadow-[0_0_58px_rgba(255,120,120,0.58)]"
                    : primaryRole === "Developer"
                    ? "group-hover:shadow-[0_0_58px_rgba(170,120,255,0.72)]"
                    : primaryRole === "Helper"
                    ? "group-hover:shadow-[0_0_58px_rgba(120,255,140,0.54)]"
                    : primaryRole === "Sponsor"
                    ? "group-hover:shadow-[0_0_72px_rgba(250,204,21,0.74)]"
                    : "group-hover:shadow-[0_0_58px_rgba(120,255,240,0.55)]"
                }`}
              >
                <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />

                {isAdmin && (
                  <label htmlFor={inputId} className="absolute inset-1 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition group-hover:opacity-100">
                    <span className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs text-white">✎</span>
                  </label>
                )}

                {isAdmin && (
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => editAvatar(index, event.target.files?.[0])}
                  />
                )}
              </div>

              <div className="relative mt-3 flex w-full items-center justify-center px-3 text-center sm:mt-4 sm:px-6">
                <span className="block w-full truncate text-center text-sm font-black tracking-[-0.03em] text-white transition duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.22)] sm:text-xl">{member.name}</span>
                {isAdmin && (
                  <button type="button" onClick={() => editName(index)} className="absolute right-0 top-1/2 -translate-y-1/2 shrink-0 rounded text-[10px] text-zinc-600 transition hover:text-white sm:text-sm">
                    ✎
                  </button>
                )}
              </div>

              <div className="mt-2 flex flex-wrap justify-center gap-1 sm:mt-3 sm:gap-1.5">
                {memberRoles.map((role) => (
                  <span
                    key={role}
                    className={`inline-flex max-w-[94px] items-center gap-1 truncate rounded-md border px-1.5 py-0.5 text-[7px] sm:max-w-[155px] sm:px-2.5 sm:py-1 sm:text-[9px] font-black uppercase tracking-[0.12em] transition duration-300 group-hover:scale-[1.035] ${getRoleStyle(role).badge}`}
                  >
                    <RoleIcon role={role} size={12} />
                    <span className="truncate">{role}</span>
                  </span>
                ))}
              </div>

              {isAdmin && (
                <div className="relative mt-3 w-full role-dropdown sm:mt-4">
                  <button
                    type="button"
                    onClick={() => setOpenRoleIndex(openRoleIndex === index ? null : index)}
                    className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.025] px-2 py-1.5 text-left text-[8px] sm:rounded-xl sm:px-3 sm:py-2 sm:text-[10px] font-black uppercase tracking-[0.12em] text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-zinc-200"
                  >
                    <span className="truncate">{t.chooseRoles}</span>
                    <span className={`ml-2 transition ${openRoleIndex === index ? "rotate-180" : ""}`}>⌄</span>
                  </button>

                  {openRoleIndex === index && (
                    <div className="absolute left-1/2 z-50 mt-2 max-h-72 w-[230px] -translate-x-1/2 overflow-y-auto rounded-xl border border-white/10 bg-[#101010]/95 p-2 text-left shadow-[0_22px_70px_rgba(0,0,0,0.75)] backdrop-blur-xl">
                      {roleOptions.map((role) => {
                        const active = memberRoles.includes(role);
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              const nextRoles = active ? memberRoles.filter((item) => item !== role) : [...memberRoles, role];
                              updateMember(index, { role: buildRoleValue(nextRoles.length ? nextRoles : ["Support"]) });
                            }}
                            className={`mb-1 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] transition ${
                              active ? getRoleStyle(role).active : "border-white/5 bg-white/[0.03] text-zinc-500 hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${getRoleStyle(role).badge}`}>
                                <RoleIcon role={role} size={14} />
                              </span>
                              <span className="truncate">{role}</span>
                            </span>
                            <span className="ml-2 shrink-0 text-sm">{active ? "✓" : "+"}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ConnectSection({ t }) {
  return (
    <section id="connect" className="mx-auto grid min-h-screen max-w-5xl items-center gap-3 px-4 py-10 sm:px-6 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr]">
      <Panel variant="command" className="p-4 sm:p-6 lg:p-8"><div className="text-[11px] font-black uppercase tracking-[0.34em] text-black/45">Connect</div><h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-5xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.connectTitle}</h2><p className="mt-4 max-w-xl text-sm leading-6 text-black/55 sm:mt-5 sm:text-lg sm:leading-8">{t.connectText}</p><div className="mt-6 overflow-x-auto rounded-xl bg-black p-4 font-mono text-xs text-white sm:mt-8 sm:p-5 sm:text-lg">connect {serverIp}</div></Panel>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-1">{t.connectSteps.map((step, index) => <Panel key={step} variant={index === 3 ? "hero" : "soft"} className="flex min-h-[76px] flex-col items-start justify-between gap-2 p-3 sm:min-h-0 sm:flex-row sm:items-center sm:p-5"><span className="text-xl font-black text-zinc-600 sm:text-4xl">0{index + 1}</span><span className="max-w-full break-words text-left text-xs font-black leading-tight sm:text-right sm:text-xl">{step}</span></Panel>)}</div>
    </section>
  );
}

function RulesSection({ t }) {
  return (
    <section id="rules" className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
      <SectionTitle eyebrow={t.rulesEyebrow} title={t.rulesTitle} text={t.rulesText} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{t.rules.map((rule, index) => <Panel key={rule} variant={index === 0 ? "command" : "soft"} className="min-h-[140px] p-4 sm:min-h-[170px] sm:p-5"><div className={`${index === 0 ? "text-black/35" : "text-zinc-600"} text-2xl font-black sm:text-4xl`}>0{index + 1}</div><div className={`${index === 0 ? "text-black" : "text-white"} mt-5 text-sm font-black leading-tight sm:mt-8 sm:text-lg`}>{rule}</div></Panel>)}</div>
    </section>
  );
}


function InventoryPage({ t, steamUser, items, loading, setItems, goHome }) {
  const [activatingId, setActivatingId] = useState(null);

  useEffect(() => {
    const processingItems = items.filter((item) => item.status === "processing" || item.status === "pending");
    if (!processingItems.length) return;

    const ids = processingItems.map((item) => item.inventoryId || item.id).filter(Boolean);
    if (!ids.length) return;

    let cancelled = false;

    async function refreshStatuses() {
      try {
        const response = await fetch(`/api/vexon?action=check-activation-statuses&ids=${encodeURIComponent(ids.join(","))}`);
        const data = await response.json();

        if (!response.ok || !Array.isArray(data.items) || cancelled) return;

        const byId = new Map(data.items.map((entry) => [entry.id, entry]));

        setItems((current) =>
          current.map((item) => {
            const key = item.inventoryId || item.id;
            const status = byId.get(key)?.status;

            if (status === "activated") return { ...item, status: "activated", activatedAt: Date.now() };
            if (status === "failed") return { ...item, status: "failed" };
            if (status === "force_revoked" || status === "revoked") return { ...item, status: "force_revoked" };
            if (status === "revoking") return { ...item, status: "revoking" };
            return item;
          })
        );
      } catch (error) {
        console.warn("Activation status refresh failed", error);
      }
    }

    refreshStatuses();
    const interval = window.setInterval(refreshStatuses, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [items, setItems]);

  const activateItem = async (item) => {
    if (!steamUser?.steamid) {
      alert(t.steam || "Sign in");
      return;
    }

    if (item.status !== "ready") return;

    const confirmSteam = window.confirm(`${t.inventoryConfirm || "Activate this item for SteamID"} ${steamUser.steamid}?`);
    if (!confirmSteam) return;

    const itemKey = item.inventoryId || item.id;
    setActivatingId(itemKey);

    setItems((current) =>
      current.map((entry) =>
        (entry.inventoryId || entry.id) === itemKey
          ? { ...entry, status: "processing" }
          : entry
      )
    );

    try {
      const response = await fetch("/api/vexon?action=activate-inventory-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryId: itemKey,
          steamId: steamUser.steamid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Activation failed");
      }

      setItems((current) =>
        current.map((entry) =>
          (entry.inventoryId || entry.id) === itemKey
            ? { ...entry, status: "processing", activationId: data?.activationId || itemKey }
            : entry
        )
      );
    } catch (error) {
      console.error("Inventory activation failed:", error);
      setItems((current) =>
        current.map((entry) =>
          (entry.inventoryId || entry.id) === itemKey
            ? { ...entry, status: "ready" }
            : entry
        )
      );
      alert(error?.message || "Activation failed");
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 pb-16 pt-20 text-white sm:px-6 sm:pb-24 sm:pt-32">
      <div className="mb-6 text-center sm:mb-10">
        <div className="text-[10px] font-black uppercase tracking-[0.42em] text-zinc-600">VEXON</div>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:mt-3 sm:text-5xl">{t.inventoryTitle || "Inventory"}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
          {t.inventoryText || "Paid privileges appear here first. Activate them only when you are ready to receive the package on your Steam account."}
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm font-black uppercase tracking-[0.22em] text-zinc-400">
          {t.loading || "Loading"}...
        </div>
      )}

      {!loading && !items.length && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <div className="text-lg font-black text-white">{t.inventoryEmpty || "Your inventory is empty."}</div>
          <button type="button" onClick={() => goHome?.("#shop")} className="mt-5 rounded-lg bg-white px-5 py-3 text-xs font-black text-black transition hover:bg-zinc-200">
            Shop
          </button>
        </div>
      )}

      {!loading && Boolean(items.length) && (
        <div className="grid gap-3 sm:justify-center sm:gap-4 sm:grid-cols-[repeat(auto-fit,minmax(320px,480px))]">
          {items.map((item, index) => {
            const itemKey = item.inventoryId || `${item.sessionId}:${item.id}:${item.index || index}`;
            const active = item.status === "activated";
            const processing = item.status === "processing" || item.status === "pending";
            const failed = item.status === "failed";
            const revoked = item.status === "force_revoked" || item.status === "revoked";
            const revoking = item.status === "revoking";
            const revokeFailed = item.status === "revoke_failed";
            const activating = activatingId === itemKey || processing || revoking;

            return (
              <div key={itemKey} className="w-full rounded-xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300/80">{item.category || "package"}</div>
                    <h3 className="mt-2 text-2xl font-black text-white">{item.name || item.id}</h3>
                    <div className="mt-1 text-xs text-zinc-500">SteamID: {steamUser?.steamid || "not linked"}</div>
                  </div>
                  <span className={`rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                    active ? "border-lime-300/30 bg-lime-400/10 text-lime-200" : revoking ? "border-orange-300/30 bg-orange-400/10 text-orange-200" : revoked ? "border-zinc-300/20 bg-zinc-400/10 text-zinc-300" : revokeFailed ? "border-red-300/30 bg-red-400/10 text-red-200" : processing ? "border-amber-300/30 bg-amber-400/10 text-amber-200" : failed ? "border-red-300/30 bg-red-400/10 text-red-200" : "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
                  }`}>
                    {active ? (t.inventoryActivated || "Activated") : revoking ? (t.profileRemovingPrivilege || "Removing...") : revoked ? (t.inventoryRevoked || "Force ended") : revokeFailed ? "Revoke failed" : processing ? "Processing" : failed ? "Failed" : (t.inventoryReady || "Ready")}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={active || activating || processing || revoked || revoking || revokeFailed}
                  onClick={() => activateItem({ ...item, index })}
                  className="mt-5 w-full rounded-lg bg-white py-3 text-sm font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {active ? (t.inventoryActivated || "Activated") : revoking ? (t.profileRemovingPrivilege || "Removing...") : revoked ? (t.inventoryRevoked || "Force ended") : revokeFailed ? "Revoke failed" : processing ? "Processing..." : failed ? "Failed" : activating ? `${t.loading || "Loading"}...` : (t.inventoryActivate || "Activate")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ProfilePage({ t, steamUser, inventoryItems = [], walletBalance = 0, isAdmin = false, onLogout, goHome }) {
  const { player } = usePlayerStats(steamUser);
  const data = player || { nickname: steamUser?.name || "STEAM_PLAYER", avatar: steamUser?.avatar || "", steamId: steamUser?.steamid || "", playtime: "0", kills: 0, deaths: 0, kd: "0.00" };
  const stats = [[t.profileStatsPlaytime || "Playtime", formatPlaytime(data.playtime)], [t.profileStatsKills || "Kills", data.kills || 0], [t.profileStatsDeaths || "Deaths", data.deaths || 0], [t.profileStatsKd || "K/D", data.kd || "0.00"]];
  const activePrivilegeItem = (inventoryItems || []).find((item) => item.status === "activated" && ["vip_30d", "sponsor_30d"].includes(item.id || item.productId || item.grantCode));
  const productId = activePrivilegeItem?.id || activePrivilegeItem?.productId || activePrivilegeItem?.grantCode;
  const shopPrivilege = (t.shopItems || []).find((item) => item.id === productId);
  const activatedValue = activePrivilegeItem?.activatedAt || activePrivilegeItem?.activated_at || activePrivilegeItem?.createdAt || activePrivilegeItem?.created_at;
  const activatedAt = activatedValue ? new Date(activatedValue).getTime() : Date.now();
  const totalDays = Number(String(activePrivilegeItem?.duration || "30d").match(/\d+/)?.[0] || 30);
  const daysElapsed = Number.isFinite(activatedAt) ? Math.max(0, Math.floor((Date.now() - activatedAt) / 86400000)) : 0;
  const daysLeft = Math.max(0, totalDays - daysElapsed);
  const vip = activePrivilegeItem
    ? {
        name: activePrivilegeItem.name || shopPrivilege?.name || (productId === "sponsor_30d" ? "SPONSOR" : "VEXON VIP"),
        daysLeft,
        perks: shopPrivilege?.perks || [],
      }
    : null;
  const hasActiveVip = Boolean(vip);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [deliveryLogs, setDeliveryLogs] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!steamUser?.steamid) return;

      try {
        const response = await fetch(`/api/vexon?action=purchase-history&steamId=${encodeURIComponent(steamUser.steamid)}`);
        const data = await response.json();

        if (!cancelled && response.ok) {
          setPurchaseHistory(Array.isArray(data.purchases) ? data.purchases : []);
          setDeliveryLogs(Array.isArray(data.logs) ? data.logs : []);
        }
      } catch (error) {
        console.warn("Purchase history load failed", error);
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [steamUser?.steamid, inventoryItems?.length]);

  return (
    <section className="mx-auto min-h-screen max-w-6xl px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-28">
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6 sm:gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.42em] text-zinc-600">{t.accountEyebrow || "Account"}</div>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] sm:mt-2 sm:text-6xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.profileTitle || "Profile"}</h1>
        </div>
        <div className="flex items-center gap-5">
          <button type="button" onClick={goHome} className="text-xs font-black text-zinc-500 transition hover:text-white">{t.back || "Back"}</button>
          <button type="button" onClick={onLogout} className="text-xs font-black text-red-400 transition hover:text-red-200">{t.logout || "Logout"}</button>
        </div>
      </div>

      <Panel className="relative overflow-hidden p-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.07),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(37,230,255,0.05),transparent_28%)]" />
        <div className="relative grid lg:grid-cols-[1fr_360px]">
          <div className="p-4 sm:p-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-black p-1 shadow-2xl sm:h-32 sm:w-32 sm:rounded-2xl">
                {data.avatar ? <img src={data.avatar} alt={data.nickname} className="h-full w-full rounded-xl object-cover" /> : <div className="flex h-full w-full items-center justify-center text-4xl font-black text-cyan-300">V</div>}
              </div>
              <div>
                <h2 className="mt-3 break-all text-3xl font-black tracking-[-0.06em] sm:mt-5 sm:text-6xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{data.nickname}</h2>
                <p className="mt-3 font-mono text-xs text-zinc-500">{data.steamId || steamUser?.steamid}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-4 sm:gap-3">
              {stats.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">{label}</div><div className="vexon-number mt-2 text-2xl font-black tracking-[-0.04em] text-white sm:mt-4 sm:text-3xl">{value}</div></div>)}
            </div>
          </div>
          <aside className="border-t border-white/10 bg-black/20 p-4 sm:p-8 lg:border-l lg:border-t-0">
            {hasActiveVip ? (
              <div className="flex h-full flex-col justify-between gap-7">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.42em] text-zinc-600">{t.profileActivePrivilege || "Active privilege"}</div>
                  <h3 className="mt-5 text-3xl font-black tracking-[-0.04em]" style={{ fontFamily: "'RustUI', sans-serif" }}>{vip.name}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm leading-6 text-zinc-500">
                    <span>{t.profileExpiresIn || "Expires in"}</span>
                    <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 font-black text-zinc-200">{vip.daysLeft} {t.profileDays || "days"}</span>
                  </p>
                  {Boolean(vip.perks?.length) && (
                    <div className="mt-6">
                      <div className="mb-3 text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">{t.profilePrivilegePerks || "Included perks"}</div>
                      <div className="space-y-2">
                        {vip.perks.map((perk) => (
                          <div key={perk} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm leading-5 text-zinc-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => goHome?.("#shop")} className="w-full rounded-xl border border-white/10 bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-zinc-200">{t.profileExtendVip || "Extend VIP"}</button>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-between gap-7">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.42em] text-zinc-600">VIP</div>
                  <h3 className="mt-5 text-3xl font-black tracking-[-0.04em]" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.profileNoPrivilegeTitle || "No active privilege"}</h3>
                  <p className="mt-4 text-sm leading-7 text-zinc-500">{t.profileNoPrivilegeText || "You do not have an active VIP package right now."}</p>
                </div>
                <button type="button" onClick={() => goHome?.("#shop")} className="w-full rounded-xl border border-white/10 bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-zinc-200">{t.profileBuyVip || "Buy VIP"}</button>
              </div>
            )}
          </aside>
        </div>
      </Panel>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">{t.profileBalance || "Balance"}</div><div className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">{walletBalance}</div><div className="mt-1 text-xs text-zinc-600">V-Coins</div></div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">{t.profileOrders || "Orders"}</div><div className="mt-2 text-2xl font-black tracking-[-0.04em] sm:mt-3 sm:text-3xl">{purchaseHistory.length}</div><div className="mt-1 text-xs text-zinc-600">Completed</div></div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <h2 className="mb-4 text-xl font-black tracking-[-0.03em]">{t.profilePurchaseHistory || "Purchase history"}</h2>
          {!purchaseHistory.length ? <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-500">{t.profileNoOrders || "No purchases yet."}</div> : (
            <div className="space-y-2">{purchaseHistory.slice(0, 8).map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3"><div className="font-black text-white">{item.product_name || item.product_id}</div><div className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300">{item.status}</div></div>
                <div className="mt-2 text-xs text-zinc-500">{t.profileDate || "Date"}: {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</div>
              </div>
            ))}</div>
          )}
        </Panel>

        <Panel className="p-5">
          <h2 className="mb-4 text-xl font-black tracking-[-0.03em]">{t.profileDeliveryLog || "VIP delivery log"}</h2>
          {!deliveryLogs.length ? <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-500">{t.profileNoLogs || "No delivery logs yet."}</div> : (
            <div className="space-y-2">{deliveryLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3"><div className="font-black text-white">{log.action || "grant"} · {log.group_name || log.grant_code}</div><div className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300">{log.status}</div></div>
                <div className="mt-2 text-xs text-zinc-500">{t.profileDate || "Date"}: {log.created_at ? new Date(log.created_at).toLocaleString() : "—"}</div>
                {log.message && <div className="mt-1 text-xs text-zinc-500">{log.message}</div>}
              </div>
            ))}</div>
          )}
        </Panel>
      </div>
    </section>
  );
}


class PublicProfileBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Public profile crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      const player = this.props.initialPlayer || {};
      const t = this.props.t || {};
      return (
        <section className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-28 sm:px-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.42em] text-zinc-600">Community</div>
              <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-6xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.profileTitle || "Profile"}</h1>
            </div>
            <button type="button" onClick={this.props.goBack} className="min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-zinc-300 transition hover:bg-white/[0.08] hover:text-white sm:px-4 sm:py-3">{t.back || "Back"}</button>
          </div>
          <Panel className="p-6">
            <div className="flex items-center gap-4">
              {player.avatar ? <img src={player.avatar} alt={player.name || "Player"} className="h-16 w-16 rounded-xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl font-black text-zinc-500">V</div>}
              <div>
                <div className="text-3xl font-black text-white" style={{ fontFamily: "'RustUI', sans-serif" }}>{player.name || player.nickname || "Unknown"}</div>
                <div className="mt-1 font-mono text-xs text-zinc-500">{player.steamid || player.steamId || this.props.steamId}</div>
              </div>
            </div>
            <p className="mt-5 text-sm text-zinc-500">{t.profileLoadFallback || "Profile data is temporarily unavailable. Basic player information is shown."}</p>
          </Panel>
        </section>
      );
    }

    return this.props.children;
  }
}

function PublicProfilePage({ t, steamId, initialPlayer = null, goBack }) {
  const baseSteamId = String(steamId || initialPlayer?.steamid || initialPlayer?.steamId || "");

  const normalizePlayer = (input = {}) => ({
    steamid: String(input.steamid || input.steamId || baseSteamId || ""),
    nickname: input.nickname || input.name || "Unknown",
    name: input.name || input.nickname || "Unknown",
    avatar: input.avatar || input.avatarUrl || input.avatar_url || input.image || "",
    playtime: input.playtimeMinutes ?? input.playtime ?? "0",
    playtimeMinutes: input.playtimeMinutes ?? input.playtime ?? "0",
    kills: Number(input.kills || 0),
    deaths: Number(input.deaths || 0),
    extraStats: input.extraStats || input.extra_stats || {},
  });

  const [player, setPlayer] = useState(() => normalizePlayer(initialPlayer || {}));
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!baseSteamId) return undefined;

    let cancelled = false;

    fetch(`/api/vexon?action=public-profile&steamid=${encodeURIComponent(baseSteamId)}&t=${Date.now()}`, { cache: "no-store" })
      .then(async (res) => {
        const text = await res.text();
        try {
          return text ? JSON.parse(text) : {};
        } catch {
          return {};
        }
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.hidden || data?.error === "profile_hidden") {
          setHidden(true);
          return;
        }
        const serverPlayer = data?.player || {};
        setPlayer((current) => normalizePlayer({ ...current, ...serverPlayer }));
      })
      .catch((error) => {
        console.warn("Public profile load failed:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [baseSteamId]);

  const parseExtraStats = (value) => {
    if (!value) return {};
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return value || {};
  };

  const pickStat = (...values) => {
    for (const value of values) {
      if (value !== undefined && value !== null && String(value) !== "") return value;
    }
    return 0;
  };

  const formatCount = (value) => {
    const number = Number(value || 0);
    if (!Number.isFinite(number)) return "0";
    return number.toLocaleString();
  };

  const profileNumberStyle = {
    fontFamily: "Arial, Helvetica, Inter, ui-sans-serif, system-ui, sans-serif",
    fontVariantNumeric: "tabular-nums",
  };

  const statIconUrl = (icon) => {
    const local = {
      scientist: "/xdstats/NPC.png",
      animal: "/xdstats/Animals.png",
      helicopter: "/xdstats/Heli.png",
      bradley: "/xdstats/Bradley.png",
      crate: "/xdstats/Crates.png",
      barrel: "/xdstats/Barrels.png",
    };

    return local[icon] || `https://rustlabs.com/img/items180/${encodeURIComponent(icon)}.png`;
  };

  if (hidden) {
    return (
      <section className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.profileTitle || "Profile"}</h1>
          <button type="button" onClick={goBack} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black text-zinc-300">{t.back || "Back"}</button>
        </div>
        <Panel className="p-6 text-center text-sm text-zinc-500">{t.publicProfileHiddenText || "This player has disabled public profile viewing."}</Panel>
      </section>
    );
  }

  const kills = Number(player.kills || 0);
  const deaths = Number(player.deaths || 0);
  const extraStats = parseExtraStats(player.extraStats || player.extra_stats);
  const resourceStats = parseExtraStats(extraStats.resources);
  const explosivesStats = parseExtraStats(extraStats.explosivesByShortname || extraStats.explosives_by_shortname || extraStats.ExplosiveUsageStats || extraStats.explosiveUsageStats);

  const topStats = [
    [t.profileStatsPlaytime || "Playtime", formatPlaytime(player.playtime || player.playtimeMinutes || "0")],
    [t.profileStatsKills || "Kills", kills],
    [t.profileStatsDeaths || "Deaths", deaths],
    [t.profileStatsKd || "K/D", deaths > 0 ? (kills / deaths).toFixed(2) : kills > 0 ? kills.toFixed(2) : "0.00"],
  ];

  const sections = [
    {
      title: t.statsCombat || "Combat",
      description: t.statsCombatText || "Combat activity and PvE events.",
      items: [
        { label: t.statNpcKills || "NPC kills", value: pickStat(extraStats.npcKills, extraStats.npc_kills, player.npcKills, player.npc_kills), icon: "scientist" },
        { label: t.statAnimalKills || "Animal kills", value: pickStat(extraStats.animalKills, extraStats.animal_kills, player.animalKills, player.animal_kills), icon: "animal" },
        { label: t.statHelicopters || "Helicopters", value: pickStat(extraStats.heliKills, extraStats.heli_kills, player.heliKills, player.heli_kills), icon: "helicopter" },
        { label: t.statBradley || "Bradley", value: pickStat(extraStats.bradleyKills, extraStats.bradley_kills, player.bradleyKills, player.bradley_kills), icon: "bradley" },
      ],
    },
    {
      title: t.statsWorld || "World",
      description: t.statsWorldText || "Looting, crafting and building activity.",
      items: [
        { label: t.statCratesOpened || "Crates opened", value: pickStat(extraStats.crates, extraStats.crateOpen, extraStats.misc?.CrateOpen, player.crates), icon: "crate" },
        { label: t.statBarrelsDestroyed || "Barrels destroyed", value: pickStat(extraStats.barrels, extraStats.barrelsDestroyed, extraStats.misc?.BarrelsDestroyed, player.barrels), icon: "barrel" },
        { label: t.statBuildingsPlaced || "Buildings placed", value: pickStat(extraStats.buildings, extraStats.buildingsPlaced, extraStats.misc?.BuildingsPlaced, player.buildings), icon: "wall.external.high.stone" },
        { label: t.statCraftedItems || "Crafted items", value: pickStat(extraStats.crafted, extraStats.totalCrafted, extraStats.misc?.TotalItemsCrafted, player.crafted), icon: "workbench3" },
      ],
    },
    {
      title: t.statsGather || "Gathering",
      description: t.statsGatherText || "Resources collected during the current wipe.",
      items: [
        { label: t.statWood || "Wood", value: pickStat(resourceStats.wood, extraStats.wood), icon: "wood" },
        { label: t.statStone || "Stone", value: pickStat(resourceStats.stones, resourceStats.stone, extraStats.stones, extraStats.stone), icon: "stones" },
        { label: t.statMetalOre || "Metal ore", value: pickStat(resourceStats["metal.ore"], resourceStats.metalOre, extraStats["metal.ore"], extraStats.metalOre), icon: "metal.ore" },
        { label: t.statSulfurOre || "Sulfur ore", value: pickStat(resourceStats["sulfur.ore"], resourceStats.sulfurOre, extraStats["sulfur.ore"], extraStats.sulfurOre), icon: "sulfur.ore" },
        { label: t.statHqmOre || "HQM ore", value: pickStat(resourceStats["hq.metal.ore"], resourceStats.hqmOre, extraStats["hq.metal.ore"], extraStats.hqmOre), icon: "hq.metal.ore" },
        { label: t.statScrap || "Scrap", value: pickStat(resourceStats.scrap, extraStats.scrap), icon: "scrap" },
      ],
    },
    {
      title: t.statsExplosions || "Raiding",
      description: t.statsExplosionsText || "Explosives and raid activity.",
      items: [
        { label: t.statRocketBasic || "Rocket (Basic)", value: pickStat(explosivesStats["ammo.rocket.basic"], explosivesStats.rocket), icon: "ammo.rocket.basic" },
        { label: t.statRocketHv || "Rocket (HV)", value: pickStat(explosivesStats["ammo.rocket.hv"], explosivesStats.hvRocket), icon: "ammo.rocket.hv" },
        { label: t.statRocketFire || "Rocket (Incendiary)", value: pickStat(explosivesStats["ammo.rocket.fire"], explosivesStats.fireRocket), icon: "ammo.rocket.fire" },
        { label: t.statC4 || "C4", value: pickStat(explosivesStats["explosive.timed"], explosivesStats.c4), icon: "explosive.timed" },
        { label: t.statSatchel || "Satchel", value: pickStat(explosivesStats["explosive.satchel"], explosivesStats.satchel), icon: "explosive.satchel" },
        { label: t.statExplosiveAmmo || "Explosive ammo", value: pickStat(explosivesStats["ammo.rifle.explosive"], explosivesStats.explosiveAmmo), icon: "ammo.rifle.explosive" },
      ],
    },
  ];

  return (
    <section className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.32em] text-zinc-600 sm:text-[10px]">Community</div>
          <h1 className="mt-1 text-4xl font-black tracking-[-0.05em] sm:text-6xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.profileTitle || "Profile"}</h1>
        </div>
        <button type="button" onClick={goBack} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-black text-zinc-300 sm:rounded-xl sm:px-4 sm:py-3 sm:text-xs">{t.back || "Back"}</button>
      </div>

      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {player.avatar ? (
              <img
                src={player.avatar}
                alt={player.nickname || "Player"}
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(player.steamid || baseSteamId || "VEXON")}&backgroundColor=111113&radius=12`;
                }}
                className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover sm:h-16 sm:w-16"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl font-black text-zinc-500 sm:h-16 sm:w-16">V</div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold text-white sm:text-3xl">{player.nickname || player.name || "Unknown"}</h2>
              <p className="mt-1 truncate font-mono text-[10px] text-zinc-500 sm:text-xs">{player.steamid || baseSteamId}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-6 sm:justify-end">
            {topStats.map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-2 sm:min-w-[88px] sm:border-0 sm:bg-transparent sm:p-0">
                <div className="truncate text-[8px] font-black uppercase tracking-[0.14em] text-zinc-600 sm:text-[10px] sm:tracking-[0.28em]">{label}</div>
                <div className="mt-1 truncate text-lg font-black tracking-[-0.04em] text-white sm:text-2xl">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="text-[9px] font-black uppercase tracking-[0.32em] text-zinc-600 sm:text-[10px] sm:tracking-[0.4em]">{t.playerStatsTitle || "Player activity"}</div>
        <p className="mt-2 text-xs text-zinc-500 sm:text-sm">{t.playerStatsText || "Player activity during the current wipe: combat, gathering and raids."}</p>
      </div>

      <div className="mt-3">
        {sections.map((section) => (
          <section key={section.title} className="grid gap-3 border-t border-white/[0.08] py-5 sm:gap-5 sm:py-7 lg:grid-cols-[230px_1fr]">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 sm:text-[10px] sm:tracking-[0.38em]">{section.title}</div>
              <p className="mt-1 max-w-none text-xs leading-5 text-zinc-500 sm:mt-2 sm:max-w-[200px] sm:text-sm sm:leading-6">{section.description}</p>
            </div>
            <div className="grid gap-x-8 lg:grid-cols-2">
              {section.items.map((item, index) => (
                <motion.div
                  key={`${section.title}-${item.label}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025 }}
                  className="group grid grid-cols-[42px_1fr_auto] items-center gap-3 border-b border-white/[0.055] px-1 py-2.5 last:border-b-0 sm:grid-cols-[52px_1fr_auto] sm:gap-4 sm:px-2 sm:py-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] sm:h-12 sm:w-12 sm:rounded-[10px]">
                    <img
                      src={statIconUrl(item.icon)}
                      alt={item.label}
                      loading="lazy"
                      className="max-h-8 max-w-8 object-contain opacity-95 sm:max-h-10 sm:max-w-10"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-zinc-300 group-hover:text-white sm:text-[15px]">{item.label}</div>
                  </div>
                  <div className="vexon-number min-w-[64px] text-right text-xl font-black tracking-[-0.05em] text-white sm:min-w-[92px] sm:text-3xl">{formatCount(item.value)}</div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function PlayersSection({ t, onOpenPlayerProfile }) {
  const [showAll, setShowAll] = useState(false);
  const [statsScope, setStatsScope] = useState("wipe");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const hiddenSteamIds = new Set(["76561199669108822"]);

    setLoading(true);

    fetch(`/api/vexon/players?scope=${statsScope}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        const rows = Array.isArray(data) ? data : [];
        const sorted = rows
          .filter((p) => !hiddenSteamIds.has(String(p.steamid || "")))
          .map((p) => {
            const kills = Number(p.kills || 0);
            const deaths = Number(p.deaths || 0);
            const playtimeMinutes = Number(p.playtime || p.playtimeMinutes || 0);
            const steamid = String(p.steamid || "");
            const rawAvatar = p.avatar || p.avatarUrl || p.image || "";
            const avatar = rawAvatar && rawAvatar !== "EMPTY"
              ? rawAvatar
              : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(steamid || p.nickname || "VEXON")}&backgroundColor=111113&radius=12`;

            return {
              name: p.nickname || p.name || "Unknown",
              steamid,
              avatar,
              playtimeMinutes,
              playtime: formatPlaytime(playtimeMinutes),
              kills,
              deaths,
              kd: deaths > 0 ? (kills / deaths).toFixed(2) : kills > 0 ? kills.toFixed(2) : "0.00",
              extraStats: p.extraStats || p.extra_stats || {},
            };
          })
          .sort((a, b) => b.playtimeMinutes - a.playtimeMinutes || b.kills - a.kills || Number(b.kd) - Number(a.kd))
          .map((p, index) => ({ ...p, rank: index + 1 }));

        setIsSwitching(true);
        window.setTimeout(() => {
          if (cancelled) return;
          setPlayers(sorted);
          window.setTimeout(() => {
            if (!cancelled) setIsSwitching(false);
          }, 40);
        }, 140);
      })
      .catch(() => {
        setIsSwitching(true);
        window.setTimeout(() => {
          if (!cancelled) setPlayers([]);
          window.setTimeout(() => {
            if (!cancelled) setIsSwitching(false);
          }, 40);
        }, 140);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [statsScope]);

  const visiblePlayers = showAll ? players : players.slice(0, 10);
  const placeStyle = (rank) => rank === 1 ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200" : rank === 2 ? "border-zinc-300/25 bg-zinc-300/10 text-zinc-200" : rank === 3 ? "border-orange-400/25 bg-orange-400/10 text-orange-200" : "border-white/10 bg-white/[0.04] text-zinc-400";

  return (
    <section id="players" className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
      <div className="mb-6">
        <div className="text-[10px] font-black uppercase tracking-[0.42em] text-zinc-600">Community</div>
        <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-6xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.players || "Players"}</h2>
      </div>

      <Panel className="mb-4 p-4 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-600">{showAll ? t.allPlayers : t.top10}</div>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:mt-3 sm:text-3xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.leaderboardTitle}</h3>
            <p className="mt-1 text-xs text-zinc-500 sm:mt-2 sm:text-sm">{statsScope === "wipe" ? (t.statsThisWipe || "This wipe") : (t.statsAllTime || "All time")}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
            <div className="relative grid grid-cols-2 overflow-hidden rounded-md border border-white/10 bg-white/[0.03] p-0.5 sm:rounded-xl sm:p-1">
              <div className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-[0_0_28px_rgba(255,255,255,0.14)] transition-transform duration-300 ease-out ${statsScope === "wipe" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"}`} />
              {[
                ["all", t.statsAllTime || "All time"],
                ["wipe", t.statsThisWipe || "This wipe"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    if (statsScope !== value) setIsSwitching(true);
                    setStatsScope(value);
                  }}
                  className={`relative z-10 min-h-11 rounded px-2 py-1 text-[9px] font-black transition-colors duration-300 sm:rounded-lg sm:px-5 sm:py-3 sm:text-xs ${statsScope === value ? "text-black" : "text-zinc-500 hover:text-white"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative grid grid-cols-2 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-0.5 sm:rounded-xl sm:p-1">
              <div className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-[0_0_28px_rgba(255,255,255,0.14)] transition-transform duration-300 ease-out ${showAll ? "translate-x-[calc(100%+4px)]" : "translate-x-0"}`} />
              {[false, true].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => {
                    if (showAll !== value) setIsSwitching(true);
                    setShowAll(value);
                    window.setTimeout(() => setIsSwitching(false), 180);
                  }}
                  className={`relative z-10 min-h-11 rounded px-2 py-1 text-[9px] font-black transition-colors duration-300 sm:rounded-lg sm:px-5 sm:py-3 sm:text-xs ${showAll === value ? "text-black" : "text-zinc-500 hover:text-white"}`}
                >
                  {value ? t.allPlayers : t.top10}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="overflow-hidden p-0">
        <div className="grid grid-cols-[55px_minmax(220px,1fr)_120px_100px_100px_80px] border-b border-white/10 px-5 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600 max-lg:hidden">
          <div>#</div><div>Player</div><div>Playtime</div><div>Kills</div><div>Deaths</div><div>K/D</div>
        </div>

        <div className={`transition-all duration-300 ease-out ${isSwitching ? "translate-y-3 opacity-0 blur-[2px]" : "translate-y-0 opacity-100 blur-0"}`}>
          {loading ? (
            <div className="p-8 text-center text-sm font-black text-zinc-500">{t.loading || "Loading"}...</div>
          ) : visiblePlayers.length ? (
            visiblePlayers.map((player) => (
              <div
                key={`${statsScope}-${showAll}-${player.steamid || player.rank}`}
                role={statsScope === "wipe" ? "button" : undefined}
                tabIndex={statsScope === "wipe" ? 0 : undefined}
                onClick={() => statsScope === "wipe" && onOpenPlayerProfile?.(player)}
                onKeyDown={(event) => {
                  if (statsScope !== "wipe") return;
                  if (event.key === "Enter" || event.key === " ") onOpenPlayerProfile?.(player);
                }}
                className={`grid w-full grid-cols-[30px_36px_minmax(0,1fr)_52px_30px_30px_38px] items-center gap-1.5 border-b border-white/10 px-2 py-2 text-left transition last:border-b-0 sm:grid-cols-[42px_48px_minmax(0,1fr)_82px_58px_58px_58px] sm:gap-2 sm:px-5 sm:py-4 lg:grid-cols-[55px_minmax(220px,1fr)_120px_100px_100px_80px] lg:gap-4 ${statsScope === "wipe" ? "cursor-pointer hover:bg-white/[0.035]" : "cursor-default"}`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-black sm:h-9 sm:w-9 sm:text-sm ${placeStyle(player.rank)}`}>{player.rank}</div>
                <img
                  src={player.avatar}
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(player.steamid || player.name || "VEXON")}&backgroundColor=111113&radius=12`;
                  }}
                  className="h-9 w-9 rounded-lg object-cover sm:h-11 sm:w-11 lg:hidden"
                />
                <div className="min-w-0 lg:flex lg:items-center lg:gap-3">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(player.steamid || player.name || "VEXON")}&backgroundColor=111113&radius=12`;
                    }}
                    className="hidden h-11 w-11 rounded-lg object-cover lg:block"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-black text-white sm:text-base lg:text-lg" style={{ fontFamily: "'RustUI', sans-serif" }}>{player.name}</div>
                    <div className="hidden truncate font-mono text-[10px] text-zinc-600 sm:block">{player.steamid}</div>
                  </div>
                </div>
                <div className="vexon-number truncate text-right text-[10px] font-black text-zinc-200 sm:text-base lg:text-left">{player.playtime}</div>
                <div className="vexon-number text-right text-[10px] font-black text-zinc-400 sm:text-base lg:text-left">{player.kills}</div>
                <div className="vexon-number text-right text-[10px] font-black text-zinc-400 sm:text-base lg:text-left">{player.deaths}</div>
                <div className="vexon-number text-right text-[10px] font-black text-zinc-200 sm:text-base lg:text-left">{player.kd}</div>
              </div>            ))
          ) : (
            <div className="p-8 text-center text-sm font-black text-zinc-500">No players yet.</div>
          )}
        </div>
      </Panel>
    </section>
  );
}


function PlayersPage({ goHome }) {
  return <PlayersSection />;
}

function SettingsPage({ t, steamUser, language, onLanguageChange, onLogout, goHome, editorMode, setEditorMode, refreshInventory, refreshWallet }) {
  const [coinSteamId, setCoinSteamId] = useState("");
  const [coinAmount, setCoinAmount] = useState("100");
  const [coinReason, setCoinReason] = useState("Admin grant");
  const [coinLoading, setCoinLoading] = useState(false);
  const [coinMessage, setCoinMessage] = useState("");

  const grantCoins = async () => {
    if (!coinSteamId.trim() || !Number(coinAmount)) return;

    setCoinLoading(true);
    setCoinMessage("");

    try {
      const response = await fetch("/api/vexon?action=admin-grant-coins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminSteamId: steamUser?.steamid,
          targetSteamId: coinSteamId.trim(),
          amount: Number(coinAmount),
          reason: coinReason || "Admin grant",
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || t.settingsGrantCoinsError || "Unable to update balance.");

      setCoinMessage(`${t.settingsGrantCoinsSuccess || "Balance updated."} ${data.balance ?? ""}`);
      if (coinSteamId.trim() === String(steamUser?.steamid || "")) {
        await refreshWallet?.();
      }
    } catch (error) {
      setCoinMessage(error?.message || t.settingsGrantCoinsError || "Unable to update balance.");
    } finally {
      setCoinLoading(false);
    }
  };

  const [revokeSteamId, setRevokeSteamId] = useState("");
  const [revokeGroup, setRevokeGroup] = useState("vip");
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeMessage, setRevokeMessage] = useState("");

  const revokePrivilege = async () => {
    if (!revokeSteamId.trim()) return;
    setRevokeLoading(true);
    setRevokeMessage("");
    try {
      const response = await fetch("/api/vexon?action=admin-revoke-privilege", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminSteamId: steamUser?.steamid, targetSteamId: revokeSteamId.trim(), group: revokeGroup }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed");
      setRevokeMessage(t.profileRemoveSuccess || "Privilege removal queued.");
      setRevokeSteamId("");
      await refreshInventory();
    } catch (error) {
      setRevokeMessage(error?.message || t.profileRemoveError || "Unable to remove privilege.");
    } finally {
      setRevokeLoading(false);
    }
  };

  const [publicProfile, setPublicProfile] = useState(true);

  useEffect(() => {
    if (!steamUser?.steamid) return undefined;

    let cancelled = false;

    fetch(`/api/vexon?action=profile-settings&steamid=${encodeURIComponent(steamUser.steamid)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data.publicProfile === "boolean") setPublicProfile(data.publicProfile);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [steamUser?.steamid]);

  const togglePublicProfile = async () => {
    const nextValue = !publicProfile;
    setPublicProfile(nextValue);

    try {
      await fetch("/api/vexon?action=profile-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          steamid: steamUser?.steamid,
          publicProfile: nextValue,
        }),
      });
    } catch (error) {
      console.warn("Profile privacy save failed:", error);
    }
  };

  const isLinked = Boolean(steamUser?.steamid);
  const isAdmin = ADMIN_STEAM_IDS.includes(String(steamUser?.steamid || ""));
  return (
    <section className="mx-auto min-h-screen max-w-5xl px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-28">
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6 sm:gap-4"><div><div className="text-[10px] font-black uppercase tracking-[0.42em] text-zinc-600">{t.accountEyebrow || "Account"}</div><h1 className="mt-1 text-3xl font-black tracking-[-0.05em] sm:mt-2 sm:text-6xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.settingsTitle || "Settings"}</h1></div><button type="button" onClick={goHome} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black text-zinc-300 transition hover:bg-white/[0.08] hover:text-white">{t.back || "Back"}</button></div>
      <div className="grid gap-5">
        <Panel className="p-4 sm:p-6"><div className="flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">{t.settingsProfile || "Profile"}</div><h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{t.settingsSteamAccount || "Steam account"}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{steamUser?.name || "Your Steam profile"} {t.settingsSteamConnected || "is connected to VEXON."}</p></div><span className={`w-fit rounded-xl border px-4 py-3 text-xs font-black ${isLinked ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-zinc-300"}`}>{isLinked ? (t.settingsLinked || "Linked") : (t.settingsNotLinked || "Not linked")}</span></div></Panel>
        <Panel className="p-4 sm:p-6"><div className="mb-4 sm:mb-5"><div className="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">{t.settingsInterface || "Interface"}</div><h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{t.settingsLanguage || "Language"}</h2></div><div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">{languages.map((item) => <button key={item.code} type="button" onClick={() => onLanguageChange(item.code)} className={`min-h-11 rounded-xl border px-3 py-3 text-left text-sm font-black transition sm:px-4 sm:py-4 ${language === item.code ? "border-white/20 bg-white text-black" : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"}`}>{item.flag} {item.name}</button>)}</div></Panel>
        <Panel className="p-4 sm:p-6"><div className="mb-4 sm:mb-5"><div className="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">{t.settingsPrivacy || "Privacy"}</div><h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{t.settingsVisibility || "Visibility"}</h2></div><div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4 sm:py-4"><div><div className="font-black">{t.settingsPublicProfile || "Public profile"}</div><div className="text-xs text-zinc-500">{t.settingsPublicProfileText || "Allow others to see your stats in Players leaderboard"}</div></div><button type="button" onClick={togglePublicProfile} className={`relative h-7 w-12 rounded-full transition ${publicProfile ? "bg-white" : "bg-zinc-700"}`}><span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-black transition-transform ${publicProfile ? "translate-x-5" : "translate-x-0"}`} /></button></div></Panel>
        {isAdmin && <Panel className="p-4 sm:p-6"><div className="mb-4 sm:mb-5"><div className="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">{t.settingsAdmin || "Admin"}</div><h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{t.settingsEditorMode || "Editor Mode"}</h2></div><div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4"><div><div className="font-black">{t.settingsEnableEditor || "Enable site editor"}</div><div className="text-xs text-zinc-500">{t.settingsEditorText || "Show edit controls for Shop and Team sections."}</div></div><button type="button" onClick={() => setEditorMode((v) => !v)} className={`relative h-7 w-12 rounded-full transition ${editorMode ? "bg-cyan-300" : "bg-zinc-700"}`}><span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-black transition-transform ${editorMode ? "translate-x-5" : "translate-x-0"}`} /></button></div></Panel>}
        <Panel className="p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">{t.settingsSession || "Session"}</div><h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{t.settingsLogoutTitle || "Logout"}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{t.settingsLogoutText || "Disconnect this browser session."}</p></div><button type="button" onClick={onLogout} className="w-fit rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm font-black text-red-300 transition hover:bg-red-400/15">{t.logout || "Logout"}</button></div></Panel>
      
        {isAdmin && <Panel className="p-5 sm:p-6">
          <div className="mb-5">
            <div className="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">{t.settingsAdmin || "Admin"}</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{t.settingsGrantCoins || "Give Vexon Coins"}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{t.settingsGrantCoinsText || "Add or remove site balance for any SteamID."}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <input value={coinSteamId} onChange={(event) => setCoinSteamId(event.target.value)} placeholder={t.settingsTargetSteamId || "Target SteamID"} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-black text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/30" />
            <input type="number" value={coinAmount} onChange={(event) => setCoinAmount(event.target.value)} placeholder={t.settingsCoinsAmount || "Coins amount"} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-black text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/30" />
          </div>
          <input value={coinReason} onChange={(event) => setCoinReason(event.target.value)} placeholder={t.settingsCoinsReason || "Reason"} className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-black text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/30" />
          <button type="button" disabled={coinLoading || !coinSteamId.trim() || !Number(coinAmount)} onClick={grantCoins} className="mt-3 w-full rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40">
            {coinLoading ? `${t.loading || "Loading"}...` : (t.settingsGrantCoinsButton || "Apply balance change")}
          </button>
          {coinMessage && <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-zinc-300">{coinMessage}</div>}
        </Panel>}

        {isAdmin && <Panel className="p-5 sm:p-6">
          <div className="mb-5">
            <div className="text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">{t.settingsAdmin || "Admin"}</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{t.profileRemovePrivilege || "Remove privilege"}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">SteamID + group</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
            <input value={revokeSteamId} onChange={(event) => setRevokeSteamId(event.target.value)} placeholder="SteamID" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-black text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/30" />
            <select value={revokeGroup} onChange={(event) => setRevokeGroup(event.target.value)} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-black text-white outline-none transition focus:border-cyan-300/30">
              <option value="vip" className="bg-[#111] text-white">VIP</option>
              <option value="sponsor" className="bg-[#111] text-white">Sponsor</option>
            </select>
          </div>
          <button type="button" disabled={revokeLoading || !revokeSteamId.trim()} onClick={revokePrivilege} className="mt-3 w-full rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-black text-red-100 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40">
            {revokeLoading ? (t.profileRemovingPrivilege || "Removing...") : (t.profileRemovePrivilege || "Remove privilege")}
          </button>
          {revokeMessage && <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-zinc-300">{revokeMessage}</div>}
        </Panel>}
</div>
    </section>
  );
}

function LogoutConfirmModal({ t, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.97, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-[0_24px_90px_rgba(0,0,0,0.65)]"
      >
        <div className="border-b border-white/10 p-5 text-center">
          <VLogo className="mx-auto h-12 w-12 drop-shadow-[0_0_28px_rgba(120,255,240,0.35)]" />
          <div className="mt-4 text-lg font-black tracking-[-0.02em] text-white">
            {t.logoutConfirmTitle || "Are you sure you want to log out?"}
          </div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-600">VEXON RUST</div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            {t.cancel || "Cancel"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg border border-red-400/20 bg-red-500/90 px-4 py-3 text-sm font-black text-white transition hover:bg-red-400"
          >
            {t.logout || "Logout"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SteamRedirectLoader({ t }) {
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center overflow-hidden bg-[#111113] text-white">
      <style>{`
        @keyframes steamGlow{0%,100%{transform:translate3d(-2%,2%,0) scale(1);opacity:.72}50%{transform:translate3d(3%,-3%,0) scale(1.08);opacity:.95}}
        @keyframes steamLogoFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.02)}}
        @keyframes steamTextRise{0%{opacity:0;transform:translateY(16px);filter:blur(8px)}100%{opacity:1;transform:translateY(0);filter:blur(0)}}
        @keyframes steamLine{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}
      `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_44%_68%,rgba(95,145,255,0.34),transparent_25%),radial-gradient(circle_at_58%_66%,rgba(120,255,240,0.18),transparent_30%)] blur-2xl animate-[steamGlow_4.8s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_74%)]" />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <VLogo className="mx-auto mb-8 h-20 w-20 drop-shadow-[0_24px_90px_rgba(0,0,0,0.55)] animate-[steamLogoFloat_4.8s_ease-in-out_infinite]" />
        <div className="text-[10px] font-black uppercase tracking-[0.46em] text-zinc-500 animate-[steamTextRise_.7s_ease_forwards]">VEXON RUST</div>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.055em] opacity-0 animate-[steamTextRise_.85s_ease_.12s_forwards] sm:text-6xl">
          {t.steamRedirectTitle || "Redirecting to Steam"}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm font-semibold leading-6 text-zinc-300 opacity-0 animate-[steamTextRise_.85s_ease_.25s_forwards] sm:text-base">
          {t.steamRedirectText || "Please wait, we are opening Steam authorization."}
        </p>
        <div className="mx-auto mt-9 h-1 w-56 overflow-hidden rounded-full bg-white/[0.08] opacity-0 animate-[steamTextRise_.85s_ease_.38s_forwards]">
          <div className="h-full w-full rounded-full bg-white/80 animate-[steamLine_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

function EntryLoader({ onDone, t }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 3000);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-[#111113] text-white animate-[loaderFade_3s_ease_forwards]">
      <style>{`@keyframes loaderFade{0%{opacity:1}78%{opacity:1}100%{opacity:0;visibility:hidden}}@keyframes softGlow{0%,100%{transform:translate3d(-2%,2%,0) scale(1);opacity:.72}50%{transform:translate3d(3%,-3%,0) scale(1.08);opacity:.95}}@keyframes floatLogo{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.015)}}@keyframes textRise{0%{opacity:0;transform:translateY(18px);filter:blur(8px)}100%{opacity:1;transform:translateY(0);filter:blur(0)}}@keyframes lineLoad{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}`}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_70%,rgba(95,145,255,0.34),transparent_25%),radial-gradient(circle_at_58%_68%,rgba(255,70,165,0.28),transparent_27%),radial-gradient(circle_at_50%_62%,rgba(135,255,220,0.18),transparent_32%)] blur-2xl animate-[softGlow_5s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.55)_74%)]" />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative mx-auto max-w-5xl px-5 text-center"><VLogo className="mx-auto mb-8 h-20 w-20 drop-shadow-[0_24px_90px_rgba(0,0,0,0.55)] animate-[floatLogo_5.5s_ease-in-out_infinite]" /><div className="text-[10px] font-black uppercase tracking-[0.46em] text-zinc-500 animate-[textRise_.8s_ease_forwards]">VEXON RUST</div><h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.055em] opacity-0 animate-[textRise_.9s_ease_.15s_forwards] sm:text-6xl lg:text-7xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t?.entryWelcome || "Welcome"}</h1><p className="mx-auto mt-6 max-w-xl text-sm font-semibold leading-6 text-zinc-300 opacity-0 animate-[textRise_.9s_ease_.3s_forwards] sm:text-base">{t?.entryLoading || "Preparing the site and loading server data."}</p><div className="mx-auto mt-9 h-1 w-56 overflow-hidden rounded-full bg-white/[0.08] opacity-0 animate-[textRise_.9s_ease_.45s_forwards]"><div className="h-full w-full rounded-full bg-white/80 animate-[lineLoad_2.4s_ease-in-out_forwards]" /></div></div>
    </div>
  );
}

export default function VexonRustSite() {
  useEffect(() => {
    document.title = "VEXON RUST";
    let icon = document.querySelector("link[rel~='icon']");
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = "/logo.png";
  }, []);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }

    const forceHomeTop = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    forceHomeTop();
    requestAnimationFrame(forceHomeTop);
    window.setTimeout(forceHomeTop, 60);
    window.setTimeout(forceHomeTop, 250);
  }, []);

  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState("home");
  const [displayPage, setDisplayPage] = useState("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [languageChanging, setLanguageChanging] = useState(false);
  const [entryLoading, setEntryLoading] = useState(shouldShowEntryLoader);
  const [steamRedirecting, setSteamRedirecting] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [steamUser, setSteamUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vexon_steam_user") || "null");
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem("vexon_steam_user")));
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [checkoutPreparing, setCheckoutPreparing] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [publicProfileSteamId, setPublicProfileSteamId] = useState("");
  const [publicProfileInitialPlayer, setPublicProfileInitialPlayer] = useState(null);

  const refreshWallet = async () => {
    if (!steamUser?.steamid) {
      setWalletBalance(0);
      return;
    }

    try {
      const response = await fetch(`/api/vexon?action=wallet&steamId=${encodeURIComponent(steamUser.steamid)}`);
      const data = await response.json();

      if (response.ok) {
        setWalletBalance(Number(data.balance || 0));
      }
    } catch (error) {
      console.error("Wallet load failed:", error);
    }
  };

  const isAdmin = ADMIN_STEAM_IDS.includes(String(steamUser?.steamid || ""));

  const refreshInventory = async () => {
    if (!steamUser?.steamid) {
      setInventoryItems([]);
      return;
    }

    setInventoryLoading(true);

    try {
      const response = await fetch(`/api/vexon?action=list-inventory&steamId=${encodeURIComponent(steamUser.steamid)}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data.items)) {
        setInventoryItems(data.items);
      }
    } catch (error) {
      console.error("Inventory load failed:", error);
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    refreshInventory();
    refreshWallet();
  }, [steamUser?.steamid]);


  const [editorMode, setEditorMode] = useState(() => {
    try {
      return localStorage.getItem("vexon_editor_mode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("vexon_editor_mode", editorMode ? "true" : "false");
  }, [editorMode]);




  useEffect(() => {
    setCheckoutPreparing(false);

    const handlePageShow = () => setCheckoutPreparing(false);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") setCheckoutPreparing(false);
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const sessionId = params.get("session_id");

    if (payment !== "success" || !sessionId) return;

    let cancelled = false;

    async function loadPaidInventory() {
      setInventoryLoading(true);

      try {
        const response = await fetch(`/api/vexon?action=verify-session&session_id=${encodeURIComponent(sessionId)}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data?.error || "Unable to verify payment");

        if (!cancelled && data?.paid) {
          await refreshInventory();
          await refreshWallet();
          setPage("inventory");
          setDisplayPage("inventory");
          setCheckoutPreparing(false);
          window.history.replaceState({}, "", window.location.pathname);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        alert(error?.message || "Payment verified, but inventory item was not created. Check Supabase ENV/table.");
      } finally {
        if (!cancelled) setInventoryLoading(false);
      }
    }

    loadPaidInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "cancelled") {
      setCheckoutPreparing(false);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamid = params.get("steamid");
    if (!steamid) return;
    const user = { steamid, name: params.get("name") || "STEAM_PLAYER", avatar: params.get("avatar") || "" };
    localStorage.setItem("vexon_steam_user", JSON.stringify(user));
    setSteamUser(user);
    setIsAuthenticated(true);
    setPage("home");
    setDisplayPage("home");
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);
  const t = content[language] || content.en;

  const navigate = (nextPage) => {
    if (nextPage === page) return;
    setIsTransitioning(true);
    window.setTimeout(() => {
      setPage(nextPage);
      setDisplayPage(nextPage);
      setIsTransitioning(false);
    }, 180);
  };

  const changeLanguage = (nextLanguage) => {
    if (nextLanguage === language) return;
    setLanguageChanging(true);
    window.setTimeout(() => {
      setLanguage(nextLanguage);
      localStorage.setItem(LANG_STORAGE_KEY, nextLanguage);
      window.setTimeout(() => setLanguageChanging(false), 450);
    }, 650);
  };

  const startSteamLogin = () => {
    setSteamRedirecting(true);
    window.setTimeout(() => {
      window.location.assign(steamAuthUrl);
    }, 900);
    window.setTimeout(() => {
      setSteamRedirecting(false);
    }, 12000);
  };

  const copyIp = async () => {
    try {
      if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
      console.warn("Could not copy server IP", error);
    }
  };

  const openLogoutConfirm = () => setLogoutConfirmOpen(true);

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
  };

  const logout = () => {
    localStorage.removeItem("vexon_steam_user");
    setSteamUser(null);
    setIsAuthenticated(false);
    navigate("home");
  };

  const goHome = (target = "#home") => {
    navigate("home");
    window.setTimeout(() => {
      if (target && target !== "#home") document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 190);
  };

  const openProfile = () => {
    refreshInventory();
    navigate("profile");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 190);
  };

  const openSettings = () => {
    navigate("settings");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 190);
  };

  const openInventory = () => {
    refreshInventory();
    navigate("inventory");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 190);
  };

  const openPublicProfile = (playerOrSteamId) => {
    const steamId = typeof playerOrSteamId === "object" ? (playerOrSteamId?.steamid || playerOrSteamId?.steamId) : playerOrSteamId;
    if (!steamId) return;
    setPublicProfileSteamId(String(steamId));
    setPublicProfileInitialPlayer(typeof playerOrSteamId === "object" ? playerOrSteamId : null);
    navigate("public-profile");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 190);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0b0b0c] text-white">
      {entryLoading && <EntryLoader t={t} onDone={() => { markEntryLoaderSeen(); setEntryLoading(false); }} />}
      {steamRedirecting && <SteamRedirectLoader t={t} />}
      {logoutConfirmOpen && <LogoutConfirmModal t={t} onCancel={() => setLogoutConfirmOpen(false)} onConfirm={confirmLogout} />}
      <div className="fixed inset-0 bg-[#0b0b0c]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.03),transparent_34%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.48)_82%)]" />
      {languageChanging && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-xl"><div className="text-center"><div className="text-2xl font-black tracking-[0.08em] text-white sm:text-3xl" style={{ fontFamily: "'RustUI', sans-serif" }}>{t.pleaseWait}</div><div className="mt-3 text-xs uppercase tracking-[0.24em] text-zinc-400">{t.changingLanguage}</div></div><div className="absolute bottom-6 text-[10px] uppercase tracking-[0.3em] text-zinc-600">© {year} VEXON RUST. {t.footer}</div></motion.div>}
      {checkoutPreparing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/80 backdrop-blur-xl"
        >
          <div className="relative text-center">
            <motion.div
              className="mx-auto mb-6 h-16 w-16 rounded-full border border-cyan-300/20 bg-cyan-300/10 shadow-[0_0_55px_rgba(120,255,240,0.24)]"
              animate={{ scale: [1, 1.12, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="text-2xl font-black tracking-[0.08em] text-white sm:text-3xl" style={{ fontFamily: "'RustUI', sans-serif" }}>
              {t.checkoutPreparingTitle || "Preparing your item"}
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
              {t.checkoutPreparingText || "Redirecting to secure Stripe checkout..."}
            </div>
          </div>
        </motion.div>
      )}
      <main className="relative z-10">
        <Header page={page} onHome={goHome} language={language} onLanguageChange={changeLanguage} t={t} isAuthenticated={isAuthenticated} steamUser={steamUser} walletBalance={walletBalance} onLogoutConfirm={openLogoutConfirm} openProfile={openProfile} openSettings={openSettings} openInventory={openInventory} onSteamLogin={startSteamLogin} cartItems={cartItems} setCartOpen={setCartOpen} cartBounce={cartBounce} />
        <div className={`transition-all duration-200 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
          {displayPage === "profile" ? (
            <ProfilePage t={t} steamUser={steamUser} inventoryItems={inventoryItems} walletBalance={walletBalance} isAdmin={isAdmin} onLogout={logout} goHome={goHome} />
          ) : displayPage === "public-profile" ? (
            <PublicProfilePage t={t} steamId={publicProfileSteamId} initialPlayer={publicProfileInitialPlayer} goBack={() => navigate("home")} />
          ) : displayPage === "settings" ? (
            <SettingsPage t={t} steamUser={steamUser} language={language} onLanguageChange={changeLanguage} onLogout={openLogoutConfirm} goHome={goHome} editorMode={editorMode} setEditorMode={setEditorMode} refreshInventory={refreshInventory} refreshWallet={refreshWallet} />
          ) : displayPage === "inventory" ? (
            <InventoryPage
              t={t}
              steamUser={steamUser}
              items={inventoryItems}
              loading={inventoryLoading}
              setItems={setInventoryItems}
              goHome={goHome}
            />
          ) : (
            <HomePage t={t} copied={copied} copyIp={copyIp} steamUser={steamUser} editorMode={editorMode} cartItems={cartItems} setCartItems={setCartItems} setCartOpen={setCartOpen} setCartBounce={setCartBounce} cartOpen={cartOpen} setCheckoutPreparing={setCheckoutPreparing} walletBalance={walletBalance} refreshWallet={refreshWallet} refreshInventory={refreshInventory} openPublicProfile={openPublicProfile} />
          )}
        </div>
        <footer className="relative border-t border-white/10 px-6 py-8 text-center text-xs uppercase tracking-[0.22em] text-zinc-600">© {year} VEXON RUST. {t.footer}</footer>
      </main>
    </div>
  );
}

console.assert(getPrimaryRole({ role: "Admin/Moderator" }) === "Admin", "Primary role parser failed");
console.assert(getMemberRoles({ role: "Owner/Developer" }).length === 2, "Multi role parser failed");
console.assert(formatTimeLeft(60).includes("m"), "Time formatter failed");

console.assert(getShopText(normalizeShopItem({ id: "x", translations: { en: { name: "A", tag: "T", perks: ["P"] }, ru: { name: "Б", tag: "М", perks: ["П"] } } }, "ru"), "ru").name === "Б", "Shop i18n translation failed");
