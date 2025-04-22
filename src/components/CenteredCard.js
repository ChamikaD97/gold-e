import React from "react";
import { Card } from "antd";
import PropTypes from "prop-types";

// Reusable CenteredCard Component
const CenteredCard = ({ title, style, children }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh", // Adjust if you don't want full screen//
        ...style,
      }}
    >
      <Card
        title={title}
        bordered={true}
        style={{
         
        
          backgroundColor:"rgb(255, 255, 255)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </Card>
    </div>
  );
};

// Prop Types
CenteredCard.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

// Default Props
CenteredCard.defaultProps = {
  title: "Card Title",
  style: {},
  children: <p>Default card content goes here.</p>,
};

export default CenteredCard;
