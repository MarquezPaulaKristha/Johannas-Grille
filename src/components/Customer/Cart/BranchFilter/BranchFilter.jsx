import React from 'react';
import { useProvider } from '../../../../global_variable/Provider';

const BranchFilter = () => {
  const { selectedBranch, setSelectedBranch } = useProvider();

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  return (
    <div>
      <label htmlFor="branch">Select Branch:</label>
      <select id="branch" value={selectedBranch} onChange={handleBranchChange}>
        <option value="Bauan">Main Branch, Bauan Batangas</option>
        <option value="Batangas">Branch 2: Batangas City</option>
      </select>
    </div>
  );
};

export default BranchFilter;
