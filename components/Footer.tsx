"use client";

interface FooterProps {
  completedCount: number;
  totalCount: number;
}

export default function Footer({ completedCount, totalCount }: FooterProps) {
  if (totalCount === 0) return null;

  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <p className="text-sm text-slate-500">
        {completedCount} of {totalCount} completed
      </p>
    </div>
  );
}
