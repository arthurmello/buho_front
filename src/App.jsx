import React, { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { BiSolidUserCircle } from "react-icons/bi";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";

// components
import Deals from "./components/Deals/Deals";
import FileBrowser from "./components/FileBrowser/FileBrowser";
import GenericModal from "./components/GenericModal/GenericModal";
import NewDealForm from "./components/NewDealForm/NewDealForm";
import Loader from "./components/Loader/Loader";
import Dashboard from "./components/Dashboard/Dashboard";
import RightSideMenu from "./components/RightSideMenu/RightSideMenu";

// api
import { fetchDeals } from "./api/deals";
import { fetchDashboardData } from "./api/dashboardData";

function App() {
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [isShowRightSideMenu, setIsShowRightSideMenu] = useState(false);
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState("");
  
  const params = new URLSearchParams(location.search);
  const user = params.get('user') || 'user';
  const userIdParam = `user=${user}`;
  const dealParam = selectedDeal ? `deal=${encodeURIComponent(selectedDeal)}` : '';
  const [dashboardData, setDashboardData] = useState({});
  const displayDashboard = dealParam !== '' && Object.keys(dashboardData).length > 0;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    fetchDashboardData(userIdParam, dealParam, setDashboardData);
  }, [userIdParam, selectedDeal]);

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar(prev => !prev);
  }, []);

  const toggleQuestionsSidebar = useCallback(() => {
    setIsShowRightSideMenu(prev => !prev);
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsShowSidebar(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // This useEffect runs once to check if the backend is awake
  useEffect(() => {
    const checkBackendStatus = async () => {
      setLoading(true);
      try {
        await fetchDeals(userIdParam, setDeals); // Call the backend to check if it's awake
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setLoading(false); // Set loading to false after the call completes
      }
    };

    checkBackendStatus();
  }, [userIdParam]); // Empty dependency array ensures this runs only once

  return (
    <>
      <Loader show={isLoading} />
      <div className="container">
        <section className={`sidebar ${isShowSidebar ? "open" : ""}`}>
        <>
          {selectedDeal === '' ? (
            <Deals
              userIdParam={userIdParam}
              deals={deals}
              setShowNewDealModal={setShowNewDealModal}
              setDeals={setDeals}
              setSelectedDeal={setSelectedDeal}
            />
          ) : (
            <FileBrowser
              userIdParam={userIdParam}
              dealParam={dealParam}
              selectedDeal={selectedDeal}
              setSelectedDeal={setSelectedDeal}
              setLoading={setLoading}
              setDashboardData={setDashboardData}
            />
          )}
        </>
          <div className="sidebar-info">
            <div className="sidebar-info-logo" style={{ display: 'flex', justifyContent: 'center' }}>
              <img src="/images/logo.png" width="30%"/>
            </div>
          </div>
        </section>
        <section className="main">
        {isShowSidebar ? (
          <MdOutlineArrowRight className="burger" size={28.8} onClick={toggleSidebar} />
        ) : (
          <MdOutlineArrowLeft className="burger" size={28.8} onClick={toggleSidebar} />
        )}
        {isShowRightSideMenu ? (
          <MdOutlineArrowLeft className="burger-right" size={28.8} onClick={toggleQuestionsSidebar} />
        ) : (
          <MdOutlineArrowRight className="burger-right" size={28.8} onClick={toggleQuestionsSidebar} />
        )}
          {displayDashboard ? (
            <Dashboard dashboardData={dashboardData} />
          ) : selectedDeal === '' ? (
            <div className="placeholder">Select a deal</div>
          ) : (
            <div className="placeholder">Upload files</div>
          )}
        </section>
      {selectedDeal && (
        <RightSideMenu
        userIdParam={userIdParam}
        dealParam={dealParam}
        isShowRightSideMenu={isShowRightSideMenu}
        setLoading={setLoading}
        />
        )}
          <GenericModal show={showNewDealModal} handleClose={() => setShowNewDealModal(false)}>
            <NewDealForm
              userIdParam={userIdParam}
              setShowNewDealModal={setShowNewDealModal}
              fetchDeals={fetchDeals}
              setDeals={setDeals}
              />
          </GenericModal>
      </div>
    </>
  );
}

export default App;