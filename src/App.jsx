// react
import React, { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { BiPlus, BiSolidUserCircle, BiSolidTrash } from "react-icons/bi";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";

// components
import Deals from "./components/Deals/Deals";
import FileBrowser from "./components/FileBrowser/FileBrowser";
import GenericModal from "./components/GenericModal/GenericModal";
import NewDealForm from "./components/NewDealForm/NewDealForm";
import GenerateFile from "./components/GenerateFile/GenerateFile";
import Loader from "./components/Loader/Loader";
import Chat from "./components/Chat/Chat";
import QaTracker from "./components/QaTracker/QaTracker";
import Dashboard from "./components/Dashboard/Dashboard";

// api
import { resetChatHistory } from "./api/chat";
import { onFileGenerationRequested } from "./api/outputFiles";
import { fetchDeals } from "./api/deals";
import { fetchDashboardData } from "./api/dashboardData";

function App() {
  const [text, setText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [qaTracker, setQaTracker] = useState([]);
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [isShowQuestionsSidebar, setIsShowQuestionsSidebar] = useState(false);
  const [owner, setOwner] = useState("");

  const [showFileGenerationModal, setShowFileGenerationModal] = useState(false);
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState("");
  
  const params = new URLSearchParams(location.search);
  const user = params.get('user') ? params.get('user') : 'user';
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
  setIsShowQuestionsSidebar(prev => !prev);
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
          {selectedDeal && (
            <div className="sidebar-header" onClick={() => setShowFileGenerationModal(true)} role="button">
              <BiPlus size={20} />
              <p>Generate file</p>
            </div>
          )}
            <div className="sidebar-info-user">
              <BiSolidUserCircle size={20} />
              <p>User</p>
            </div>
            <div className="sidebar-info-clearchat" onClick={() => resetChatHistory(userIdParam, dealParam, setChatHistory)} role="button">
              <BiSolidTrash size={20} />
              <p>Clear chat</p>
            </div>
          </div>
        </section>
        <section className="main">
        {/* <div className="main-header">
          <h1>Investment Banking Analyst</h1>
          <h3>How can I help you today?</h3>
        </div> */}
        {isShowSidebar ? (
          <MdOutlineArrowRight className="burger" size={28.8} onClick={toggleSidebar} />
        ) : (
          <MdOutlineArrowLeft className="burger" size={28.8} onClick={toggleSidebar} />
        )}
        {isShowQuestionsSidebar ? (
          <MdOutlineArrowLeft className="burger-right" size={28.8} onClick={toggleQuestionsSidebar} />
        ) : (
          <MdOutlineArrowRight className="burger-right" size={28.8} onClick={toggleQuestionsSidebar} />
        )}
          {/* {displayDashboard ? (
            <Dashboard dashboardData={dashboardData} />
          ) : selectedDeal === '' ? (
            <div className="placeholder">Select a Deal</div>
          ) : (
            <div className="placeholder">Upload files</div>
          )} */}
          <Chat
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            text={text}
            setText={setText}
            userIdParam={userIdParam}
            dealParam={dealParam}
            owner={user}
          />
        </section>
        {selectedDeal && (
        <QaTracker
          userIdParam={userIdParam}
          dealParam={dealParam}
          qaTracker={qaTracker}
          setQaTracker={setQaTracker}
          isShowQuestionsSidebar={isShowQuestionsSidebar}
          setOwner={setOwner}
          setText={setText}
          owner={owner}
        />
      )}
          <GenericModal show={showFileGenerationModal} handleClose={() => setShowFileGenerationModal(false)}>
            <GenerateFile
              onFileGenerationRequest={(data) => onFileGenerationRequested({ ...data, setShowFileGenerationModal, setLoading, userIdParam, dealParam})}
              />
          </GenericModal>

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