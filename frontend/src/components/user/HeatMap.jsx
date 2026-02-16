import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

// function to generate random activity
const generateActivityData = (startDate, endDate) => {
    const data = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        const count = Math.floor(Math.random() * 50);

        data.push({
            date: currentDate.toISOString().split('T')[0],
            count: count,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
};

const getPanelColors = (maxCount) => {
    const colors = {};
    for (let i = 0; i <= maxCount; i++) {
        const greenValue = Math.floor((i / maxCount) * 255);
        colors[i] = `rgb(0,${greenValue},0)`;
    }
    return colors;
};

const HeatMapProfile = () => {
    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Generate data for the last 365 days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 365);

            const data = generateActivityData(startDate, endDate);
            setActivityData(data);
        };
        fetchData();
    }, []);

    return (
        <div className="heatmap-container">
            <h3 className="heatmap-title">Recent Contributions</h3>
            <HeatMap
                className="HeatMapProfile"
                style={{ color: "#8b949e" }}
                value={activityData}
                weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
                rectSize={12}
                space={4}
                rectProps={{
                    rx: 2,
                }}
                panelColors={{
                    0: '#161b22',
                    8: '#0e4429',
                    16: '#006d32',
                    24: '#26a641',
                    32: '#39d353'
                }}
            />
        </div>
    );
};

export default HeatMapProfile;