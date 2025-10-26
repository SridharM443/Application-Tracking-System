import React from 'react';
import { applicationService } from '../../services/applicationService';

const ApplicationForm = ({ jobId, onSuccess }) => {

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await applicationService.createApplication({ jobPostingId: jobId });
      alert('Application submitted successfully!');
      if(onSuccess) onSuccess();
    } catch (err) {
      alert('Failed to submit application');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">
        Confirm Apply
      </button>
    </form>
  );
};

