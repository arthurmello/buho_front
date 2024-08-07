import React from "react";

import "./Dashboard.css";

const Dashboard = ( {dashboardData} ) => {

  const formatKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const KpiList = ({ data }) => {
    if (!data) {
      return null;
    }

    return (
      <div>
        {Object.entries(data).map(([key, value]) => (
          <React.Fragment key={key}>
            <h3>{formatKey(key)}</h3>
            <p>{value}</p>
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="grid-container">
      <div className="row1">
        <div className="logo">
          <img src={dashboardData.company_logo} alt="Logo" />
        </div>
        <div className="name">
          <h1>{dashboardData.company_name}</h1>
        </div>
      </div>
      <div className="row2">
      <div className="kpi">
          <KpiList data={dashboardData.kpi} />
        </div>
        <div className="summary">
          <p>{dashboardData.deal_summary}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;