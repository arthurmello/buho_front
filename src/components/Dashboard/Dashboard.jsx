import React from "react";
import "./Dashboard.css";

const Dashboard = ({ dashboardData }) => {
  const formatKey = (key) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const KpiList = ({ data }) => {
    if (!data) {
      return null;
    }

    return (
      <div>
        {Object.entries(data).map(([key, value]) => (
          <React.Fragment key={key}>
            <h4>{formatKey(key)}</h4>
            <p>{value}</p>
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  };

  const RisksList = ({ risks }) => {
    if (!risks) {
      return null;
    }

    return (
      <div className="risks-container">
        {Object.keys(risks).map((category) => (
          <div key={category} className="risks-category">
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Risks</h3>
            <ul>
              {risks[category].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
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
          <h2>{dashboardData.company_name}</h2>
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

      <div className="row3">
        <RisksList risks={dashboardData.risks} />
      </div>
    </div>
  );
};

export default Dashboard;