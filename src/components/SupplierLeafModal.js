import React, { useEffect, useState } from "react";
import { Modal, Calendar, Spin, Alert, Card } from "antd";
import dayjs from "dayjs";
import CircularLoader from "../components/CircularLoader";

import { API_KEY, getMonthDateRangeFromParts } from "../api/api";

// Simulated API call (replace with actual import)


const SupplierLeafModal = ({ open, onClose, filters, selectedDate, supplierId }) => {
    const [leafData, setLeafData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [supplierLeafData, setSupplierLeafData] = useState([]);

    const [error, setError] = useState(null);


    useEffect(() => {
        if (open && supplierId) {
            setLoading(true);
            getLeafRecordsBySupplierId({ filters, supplierId })
                .then((data) => {
                    setLeafData(data || []);
                    setError(null);
                })
                .catch((err) => {
                    setError("Failed to fetch leaf records.");
                })
                .finally(() => setLoading(false));
        }
    }, [supplierId, open]);

    const dateCellRender = (value) => {
        const dateStr = value.format("YYYY-MM-DD");
        const records = leafData.filter((d) => d.date === dateStr);
        return records.length ? (
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                {records.map((item, idx) => (
                    <li key={idx} style={{ fontSize: 12 }}>
                        {item.leaf_type}: {item.net_kg} kg
                    </li>
                ))}
            </ul>
        ) : null;
    };
    const cardStyle = {
        background: "rgba(0, 0, 0, 0.6)",
        color: "#fff",
        borderRadius: 12,
        marginBottom: 6
    };


    const getLeafRecordsBySupplierId = async ({ filters, supplierId }) => {
        const baseUrl = "/quiX/ControllerV1/glfdata";
        const range = getMonthDateRangeFromParts(filters.year, filters.month);
        console.log(range);

        const params = new URLSearchParams({ k: API_KEY, s: supplierId, d: '2025-05-06' });
        const url = `${baseUrl}?${params.toString()}`;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch supplier leaf data");
            const data = await response.json();
            setSupplierLeafData(Array.isArray(data) ? data : data ? [data] : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load supplier data");
            setSupplierLeafData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`Leaf Records for Supplier ${supplierId}`}
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
        >
            <Card bordered={false} style={{ ...cardStyle }}>
                {loading ? (
                    <CircularLoader />
                ) : error ? (
                    <Alert type="error" message={error} />
                ) : (
                    <Calendar
                        fullscreen={false}
                        defaultValue={dayjs(selectedDate)}
                        dateCellRender={dateCellRender}
                    />
                )}

            </Card>

        </Modal>
    );
};

export default SupplierLeafModal;
