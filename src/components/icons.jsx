// Maps the stable string icon-keys stored in data/scenarios.js to lucide-react
// components, so data files stay free of JSX imports. Keys are UI glyphs only —
// not Thai copy. Render <Icon className="h-4 w-4" /> at the call site.
import {
  Target,
  Thermometer,
  Search,
  Lightbulb,
  Smile,
  Clock,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Signal,
  Smartphone,
  Globe,
  Receipt,
  Repeat,
  Wifi,
  IdCard,
  CreditCard,
  Package,
  FileText,
  ScanFace,
  Banknote,
  Home,
  HelpCircle,
} from 'lucide-react'

const ICONS = {
  // diagnosis question kinds
  target: Target,
  thermometer: Thermometer,
  search: Search,
  lightbulb: Lightbulb,
  // impact wins
  smile: Smile,
  clock: Clock,
  wallet: Wallet,
  trendingup: TrendingUp,
  shieldcheck: ShieldCheck,
  // queue services
  signal: Signal,
  smartphone: Smartphone,
  globe: Globe,
  receipt: Receipt,
  repeat: Repeat,
  wifi: Wifi,
  // docs
  idcard: IdCard,
  creditcard: CreditCard,
  package: Package,
  file: FileText,
  scanface: ScanFace,
  banknote: Banknote,
  home: Home,
}

export function getIcon(key) {
  return ICONS[key] || HelpCircle
}
