// react
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
  const userIdParam = `user=${user}`
  const dealParam = selectedDeal ? `deal=${encodeURIComponent(selectedDeal)}` : '';
  const [dashboardData, setDashboardData] = useState({});
  const displayDashboard = dealParam !== '' && Object.keys(dashboardData).length > 0;

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
            />
          )}
        </>
          <div className="sidebar-info">
            <div className="sidebar-info-user">
              <BiSolidUserCircle size={20} />
              <p>User</p>
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
            <div className="placeholder">Select a Deal</div>
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
              userIdParam = {userIdParam}
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