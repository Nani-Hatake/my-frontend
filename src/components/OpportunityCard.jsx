import { STAGE_STYLES, PRIORITY_STYLES, formatCurrency, formatDate } from "../utils/constants.js";

const OpportunityCard = ({ opportunity, currentUserId, onEdit, onDelete }) => {
  const isOwner = opportunity.owner?._id === currentUserId || opportunity.owner === currentUserId;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold text-ink-900">
            {opportunity.customerName}
          </h3>
          {opportunity.contactName && (
            <p className="truncate text-xs text-ink-700/70">{opportunity.contactName}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            STAGE_STYLES[opportunity.stage] || STAGE_STYLES.New
          }`}
        >
          {opportunity.stage}
        </span>
      </div>

      <p className="line-clamp-2 text-sm text-ink-700">{opportunity.requirement}</p>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-full px-2.5 py-1 font-semibold ${
            PRIORITY_STYLES[opportunity.priority] || PRIORITY_STYLES.Medium
          }`}
        >
          {opportunity.priority} priority
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-ink-700">
          {formatCurrency(opportunity.estimatedValue)}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-ink-700/70">
        <span>Follow-up: {formatDate(opportunity.nextFollowUpDate)}</span>
        <span className="truncate">
          by {isOwner ? "you" : opportunity.owner?.name || "Unknown"}
        </span>
      </div>

      {/* Frontend hides actions for non-owners as a UX convenience.
          The real authorization boundary is enforced server-side. */}
      {isOwner && (
        <div className="flex gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => onEdit(opportunity)}
            className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-ink-800 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(opportunity)}
            className="flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;
