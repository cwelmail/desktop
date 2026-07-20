export type PlanTier = "free" | "pro" | "cipher"

export const FREE_ALIAS_LIMIT = 5

export const FREE_PLAN_FEATURES = [
  { icon: "ph:tray", label: "Receive mail on disposable aliases" },
  { icon: "ph:at", label: `Up to ${FREE_ALIAS_LIMIT} aliases` },
  { icon: "ph:flame", label: "Burn aliases anytime" },
] as const

export const PRO_PLAN_FEATURES = [
  { icon: "ph:paper-plane-tilt", label: "Send from any alias you own" },
  { icon: "ph:at", label: "Unlimited aliases with custom names" },
  { icon: "ph:prohibit", label: "Block senders across aliases" },
  { icon: "ph:ghost", label: "Pay with Monero — unlinkable from your identity" },
  { icon: "ph:calendar", label: "30 days Pro per payment" },
] as const

export const PRO_UPGRADE_EMBED = {
  eyebrow: "Phantom Pro",
  title: "Send mail privately",
  description: "Free accounts receive only. Upgrade with Monero or card/crypto — no name, no link to your login key.",
  highlights: [
    { icon: "ph:paper-plane-tilt", label: "Send from any alias you own" },
    { icon: "ph:ghost", label: "Pay with Monero or card/crypto — private" },
    { icon: "ph:calendar", label: "30 days Pro per payment" },
  ],
} as const

export const PRO_ACTIVE_EMBED = {
  eyebrow: "Phantom Pro",
  title: "Phantom is active",
  description: "Sending enabled — compose from any alias you own.",
  highlights: [
    { icon: "ph:paper-plane-tilt", label: "Send from any alias you own" },
    { icon: "ph:at", label: "Unlimited aliases with custom names" },
    { icon: "ph:prohibit", label: "Block senders across aliases" },
  ],
} as const

export type CurrencyCode = "btc" | "eth" | "ltc" | "usdt" | "usdc" | "bnb" | "sol" | "matic" | "dai" | "trx" | "xrp" | "ada" | "doge"

export const SUPPORTED_CURRENCIES: { value: CurrencyCode; label: string }[] = [
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "ltc", label: "Litecoin (LTC)" },
  { value: "usdt", label: "Tether (USDT)" },
  { value: "usdc", label: "USD Coin (USDC)" },
]

export const CURRENCY_META: Record<CurrencyCode, { label: string; color: string; symbol: string; iconUrl: string }> = {
  btc: { label: "Bitcoin (BTC)", color: "#F7931A", symbol: "₿", iconUrl: "https://api.iconify.design/simple-icons/bitcoin.svg" },
  eth: { label: "Ethereum (ETH)", color: "#627EEA", symbol: "Ξ", iconUrl: "https://api.iconify.design/simple-icons/ethereum.svg" },
  ltc: { label: "Litecoin (LTC)", color: "#345D9D", symbol: "Ł", iconUrl: "https://api.iconify.design/simple-icons/litecoin.svg" },
  usdt: { label: "Tether (USDT)", color: "#26A17B", symbol: "₮", iconUrl: "https://api.iconify.design/simple-icons/tether.svg" },
  usdc: { label: "USD Coin (USDC)", color: "#2775CA", symbol: "₵", iconUrl: "https://api.iconify.design/simple-icons/usdcoin.svg" },
  bnb: { label: "BNB", color: "#F0B90B", symbol: "B", iconUrl: "https://api.iconify.design/simple-icons/bnb.svg" },
  sol: { label: "Solana (SOL)", color: "#9945FF", symbol: "S", iconUrl: "https://api.iconify.design/simple-icons/solana.svg" },
  matic: { label: "Polygon (MATIC)", color: "#8247E5", symbol: "M", iconUrl: "https://api.iconify.design/simple-icons/polygon.svg" },
  dai: { label: "Dai (DAI)", color: "#F5AC37", symbol: "D", iconUrl: "https://api.iconify.design/simple-icons/maker.svg" },
  trx: { label: "TRON (TRX)", color: "#EF0027", symbol: "T", iconUrl: "https://api.iconify.design/simple-icons/tron.svg" },
  xrp: { label: "XRP", color: "#23292F", symbol: "X", iconUrl: "https://api.iconify.design/simple-icons/ripple.svg" },
  ada: { label: "Cardano (ADA)", color: "#0033AD", symbol: "A", iconUrl: "https://api.iconify.design/simple-icons/cardano.svg" },
  doge: { label: "Dogecoin (DOGE)", color: "#C2A633", symbol: "Đ", iconUrl: "https://api.iconify.design/simple-icons/dogecoin.svg" },
}

export const PLAN_SUMMARY = {
  free: { name: "Free", tagline: "Receive privately. No payment required.", price: "Free", period: "forever", icon: "ph:tray" },
  pro: { name: "Pro", tagline: "Send mail, unlimited aliases, and block senders.", price: "~$6", period: "per 30 days", icon: "ph:ghost" },
  cipher: { name: "Cipher", tagline: "Shared inboxes, custom domains, and API access for teams.", price: "$14", period: "/ month", icon: "ph:lock-key" },
} as const
