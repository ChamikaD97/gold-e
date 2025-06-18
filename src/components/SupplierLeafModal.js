import React, { useEffect, useState } from "react";
import { Modal, Calendar, Spin, Alert } from "antd";
import dayjs from "dayjs";
import { getLeafRecordsBySupplierId } from "../api/api";

// Simulated API call (replace with actual import)


const SupplierLeafModal = ({ open, onClose, selectedDate, supplierId }) => {
    const [leafData, setLeafData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && supplierId) {
            setLoading(true);
            getLeafRecordsBySupplierId(supplierId)
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

    return (
        <Modal
            title={`Leaf Records for Supplier ${supplierId}`}
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
        >
            {loading ? (
                <Spin tip="Loading..." />
            ) : error ? (
                <Alert type="error" message={error} />
            ) : (
                <Calendar
                    fullscreen={false}
                    defaultValue={dayjs(selectedDate)}
                    dateCellRender={dateCellRender}
                />
            )}
        </Modal>
    );
};

export default SupplierLeafModal;
