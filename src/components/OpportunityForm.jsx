import { useState, useEffect } from "react";
import Input from "./Input.jsx";
import Select from "./Select.jsx";
import Button from "./Button.jsx";
import { STAGES, PRIORITIES, toDateInputValue } from "../utils/constants.js";

const emptyForm = {
  customerName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  requirement: "",
  estimatedValue: "",
  stage: "New",
  priority: "Medium",
  nextFollowUpDate: "",
  notes: "",
};

const OpportunityForm = ({ initialData, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        customerName: initialData.customerName || "",
        contactName: initialData.contactName || "",
        contactEmail: initialData.contactEmail || "",
        contactPhone: initialData.contactPhone || "",
        requirement: initialData.requirement || "",
        estimatedValue: initialData.estimatedValue ?? "",
        stage: initialData.stage || "New",
        priority: initialData.priority || "Medium",
        nextFollowUpDate: toDateInputValue(initialData.nextFollowUpDate),
        notes: initialData.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.customerName.trim()) next.customerName = "Customer / company name is required";
    if (!form.requirement.trim()) next.requirement = "Requirement summary is required";
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
      next.contactEmail = "Enter a valid email address";
    }
    if (form.estimatedValue !== "" && Number(form.estimatedValue) < 0) {
      next.estimatedValue = "Value cannot be negative";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      estimatedValue: form.estimatedValue === "" ? 0 : Number(form.estimatedValue),
      nextFollowUpDate: form.nextFollowUpDate || null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Customer / company name"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Acme Industries"
          error={errors.customerName}
          required
        />
        <Input
          label="Contact person"
          name="contactName"
          value={form.contactName}
          onChange={handleChange}
          placeholder="Priya Sharma"
        />
        <Input
          label="Contact email"
          type="email"
          name="contactEmail"
          value={form.contactEmail}
          onChange={handleChange}
          placeholder="priya@acme.com"
          error={errors.contactEmail}
        />
        <Input
          label="Contact phone"
          name="contactPhone"
          value={form.contactPhone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
        />
      </div>

      <Input
        label="Requirement / need summary"
        name="requirement"
        value={form.requirement}
        onChange={handleChange}
        placeholder="Looking for a CRM integration with their existing ERP"
        error={errors.requirement}
        textarea
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Estimated deal value (₹)"
          type="number"
          name="estimatedValue"
          value={form.estimatedValue}
          onChange={handleChange}
          placeholder="150000"
          min="0"
          step="1000"
          error={errors.estimatedValue}
        />
        <Input
          label="Next follow-up date"
          type="date"
          name="nextFollowUpDate"
          value={form.nextFollowUpDate}
          onChange={handleChange}
        />
        <Select
          label="Stage"
          name="stage"
          value={form.stage}
          onChange={handleChange}
          options={STAGES.map((s) => ({ value: s, label: s }))}
        />
        <Select
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          options={PRIORITIES.map((p) => ({ value: p, label: p }))}
        />
      </div>

      <Input
        label="Notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Any additional context, history, or internal notes"
        textarea
        rows={3}
      />

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initialData ? "Save changes" : "Create opportunity"}
        </Button>
      </div>
    </form>
  );
};

export default OpportunityForm;
