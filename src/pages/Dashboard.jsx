import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Button from "../components/Button.jsx";
import Select from "../components/Select.jsx";
import Modal from "../components/Modal.jsx";
import OpportunityCard from "../components/OpportunityCard.jsx";
import OpportunityForm from "../components/OpportunityForm.jsx";
import {
  fetchOpportunities,
  fetchOpportunitySummary,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../services/opportunityService.js";
import { STAGES, PRIORITIES, formatCurrency } from "../utils/constants.js";

const DashboardPage = () => {
  const { user } = useAuth();

  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [stageFilter, setStageFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const params = {};
      if (stageFilter) params.stage = stageFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const [oppRes, summaryRes] = await Promise.all([
        fetchOpportunities(params),
        fetchOpportunitySummary(),
      ]);
      setOpportunities(oppRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setLoadError(
        err.response?.data?.message || "Could not load opportunities. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [stageFilter, priorityFilter, search]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  const openCreateModal = () => {
    setEditingOpportunity(null);
    setFormError("");
    setShowFormModal(true);
  };

  const openEditModal = (opportunity) => {
    setEditingOpportunity(opportunity);
    setFormError("");
    setShowFormModal(true);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    setFormError("");
    try {
      if (editingOpportunity) {
        await updateOpportunity(editingOpportunity._id, payload);
        showToast("Opportunity updated");
      } else {
        await createOpportunity(payload);
        showToast("Opportunity created");
      }
      setShowFormModal(false);
      loadOpportunities();
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteOpportunity(deleteTarget._id);
      showToast("Opportunity deleted");
      setDeleteTarget(null);
      loadOpportunities();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not delete opportunity", "error");
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = stageFilter || priorityFilter || search;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">Opportunity pipeline</h1>
            <p className="mt-1 text-sm text-ink-700/70">
              Shared across your team — everyone can view, only owners can edit
            </p>
          </div>
          <Button onClick={openCreateModal}>+ New opportunity</Button>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Open pipeline value"
              value={formatCurrency(summary.totalPipelineValue)}
            />
            <SummaryCard label="Won value" value={formatCurrency(summary.wonValue)} />
            <SummaryCard
              label="High priority (open)"
              value={summary.highPriorityOpenCount}
            />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Select
              label="Stage"
              name="stageFilter"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              options={[{ value: "", label: "All stages" }, ...STAGES.map((s) => ({ value: s, label: s }))]}
            />
          </div>
          <div className="flex-1">
            <Select
              label="Priority"
              name="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: "", label: "All priorities" },
                ...PRIORITIES.map((p) => ({ value: p, label: p })),
              ]}
            />
          </div>
          <div className="flex-[2]">
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or requirement..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={() => {
                setStageFilter("");
                setPriorityFilter("");
                setSearch("");
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Content states */}
        {loading && (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}

        {!loading && loadError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="font-medium text-red-700">{loadError}</p>
            <Button variant="secondary" className="mt-4" onClick={loadOpportunities}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !loadError && opportunities.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold text-ink-900">
              {hasFilters ? "No opportunities match your filters" : "No opportunities yet"}
            </p>
            <p className="mt-1 text-sm text-ink-700/70">
              {hasFilters
                ? "Try clearing your filters or searching for something else."
                : "Create your first opportunity to start building the pipeline."}
            </p>
            {!hasFilters && (
              <Button className="mt-4" onClick={openCreateModal}>
                + New opportunity
              </Button>
            )}
          </div>
        )}

        {!loading && !loadError && opportunities.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                currentUserId={user?.id}
                onEdit={openEditModal}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit modal */}
      {showFormModal && (
        <Modal
          title={editingOpportunity ? "Edit opportunity" : "New opportunity"}
          onClose={() => setShowFormModal(false)}
        >
          {formError && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {formError}
            </div>
          )}
          <OpportunityForm
            initialData={editingOpportunity}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowFormModal(false)}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <Modal
          title="Delete opportunity?"
          onClose={() => setDeleteTarget(null)}
          maxWidth="max-w-sm"
        >
          <p className="text-sm text-ink-700">
            This will permanently delete{" "}
            <span className="font-semibold text-ink-900">{deleteTarget.customerName}</span>. This
            action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg px-5 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-ink-900 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-ink-700/60">{label}</p>
    <p className="mt-1 font-display text-2xl font-bold text-ink-900">{value}</p>
  </div>
);

export default DashboardPage;
