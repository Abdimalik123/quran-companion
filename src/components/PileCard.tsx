import { BookOpen, RefreshCcw, Library } from "lucide-react";
import { motion } from "framer-motion";

interface PileCardProps {
  type: 'sabbak' | 'sabqi' | 'manzil';
  pages: number[];
  completedPages: number[];
  onStartSession: () => void;
}

const pileConfig = {
  sabbak: {
    title: 'New',
    subtitle: 'New Lesson',
    icon: BookOpen,
    arabicTitle: 'سبق',
    description: 'Today\'s new memorization pages',
  },
  sabqi: {
    title: 'Recent',
    subtitle: 'Recent Review',
    icon: RefreshCcw,
    arabicTitle: 'سبقی',
    description: 'Last 7 days of lessons',
  },
  manzil: {
    title: 'Old',
    subtitle: 'Full Revision',
    icon: Library,
    arabicTitle: 'منزل',
    description: 'Rotating through your Hifz',
  },
};

export function PileCard({ type, pages, completedPages, onStartSession }: PileCardProps) {
  const config = pileConfig[type];
  const Icon = config.icon;
  const progress = pages.length > 0 ? (completedPages.length / pages.length) * 100 : 0;
  const isComplete = pages.length > 0 && completedPages.length >= pages.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pile-card cursor-pointer group"
      onClick={onStartSession}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isComplete ? 'bg-confidence-strong/15' : 'bg-primary/10'} transition-colors`}>
            <Icon className={`h-5 w-5 ${isComplete ? 'text-confidence-strong' : 'text-primary'}`} />
          </div>
          <div>
            <h3 className="font-display text-lg text-foreground">{config.title}</h3>
            <p className="text-xs text-muted-foreground">{config.subtitle}</p>
          </div>
        </div>
        <span className="font-display text-xl text-gold opacity-60">{config.arabicTitle}</span>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{config.description}</p>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{completedPages.length}/{pages.length} pages</span>
        <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${isComplete ? 'bg-confidence-strong' : 'bg-primary'}`}
        />
      </div>

      {pages.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          Pages: {pages.slice(0, 5).join(', ')}{pages.length > 5 ? ` +${pages.length - 5} more` : ''}
        </p>
      )}
    </motion.div>
  );
}
