// react
import React, { useState } from "react";

// components
import Chat from "../Chat/Chat"
import QaTracker from "../QaTracker/QaTracker";
import GenerateFile from "../GenerateFile/GenerateFile";

// css
import styles from "./RightSideMenu.module.css";


const RightSideMenu = ({
    userIdParam,
    dealParam,
    isShowRightSideMenu,
    setLoading
}) => {
    const [selectedFeature, setSelectedFeature] = useState("")
    const features = ["Generate file", "Chat", "Q&A Tracker"]
    const FeatureButtons = () => {
        return features.map((feature, index) => (
            <div key={index} className={styles.buttonGrid}>
                <div
                    onClick={() => setSelectedFeature(feature)}
                    className="btn"
                >
                    {feature}
                </div>
            </div>
        ));
    };
    const featureComponents = {
        "Chat": (
          <div className={styles.chatContainer}>
            <Chat
              userIdParam={userIdParam}
              dealParam={dealParam}
              setSelectedFeature={setSelectedFeature}
            />
          </div>
        ),
        "Q&A Tracker": (
          <div className={styles.qaTrackerContainer}>
            <QaTracker
              userIdParam={userIdParam}
              dealParam={dealParam}
              setSelectedFeature={setSelectedFeature}
            />
          </div>
        ),
        "Generate file": (
          <div>
            <GenerateFile
              userIdParam={userIdParam}
              dealParam={dealParam}
              setSelectedFeature={setSelectedFeature}
              setLoading={setLoading}
            />
          </div>
        ),
      };
    
    return (
        <>
            <div className={`sidebar ${isShowRightSideMenu ? "open" : ""}`}>
                {!selectedFeature && <div className={styles.featureButtonsContainer}>
                    <FeatureButtons />
                </div>}
                {featureComponents[selectedFeature]}
            </div>
        </>
    );
};

export default RightSideMenu;
