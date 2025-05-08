

export function getTotalLeaf(data, range = "today") {
  const now = new Date();
  return data
    .filter(d => {
      const date = new Date(d.date);
      if (range === "today") return date.toDateString() === now.toDateString();
      if (range === "week") {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo && date <= now;
      }
      if (range === "month") return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, d) => sum + parseFloat(d.net_kg || 0), 0);
}

export function getLastMonthSummaryByOfficer(data) {
  if (!data || data.length === 0) return [];

  // Step 1: Find latest month in the dataset
  const months = [...new Set(data.map(d => d.month))];
  const latestMonth = months.sort((a, b) => new Date(b) - new Date(a))[0];

  // Step 2: Filter records for that latest month
  const lastMonthData = data.filter(d => d.month === latestMonth);

  // Step 3: Group by officer
  const grouped = {};

  lastMonthData.forEach(({ field_officer, target, achieved }) => {
    if (!grouped[field_officer]) {
      grouped[field_officer] = { target: 0, achieved: 0 };
    }
    grouped[field_officer].target += target;
    grouped[field_officer].achieved += achieved;
  });

  // Step 4: Convert to array with progress %
  return Object.entries(grouped).map(([officer, { target, achieved }]) => ({
    officer,
    month: latestMonth,
    target,
    achieved,
    progress: target > 0 ? parseFloat(((achieved / target) * 100).toFixed(2)) : 0
  }));
}


export function getLatestAchievementByOfficerFromSupplierData(data, lineToOfficer, targetsByOfficer) {
  const grouped = {};

  data.forEach(({ date, net_kg, line }) => {
    const officer = lineToOfficer[line];
    if (!officer) return;

    const month = date.slice(0, 7);

    const key = `${officer}_${month}`;
    if (!grouped[key]) {
      grouped[key] = {
        officer,
        month,
        achieved: 0
      };
    }

    grouped[key].achieved += net_kg;
  });

  const latestMonth = Object.values(grouped)
    .map(r => r.month)
    .sort((a, b) => new Date(b) - new Date(a))[0];

  const result = Object.values(grouped)
    .filter(r => r.month === latestMonth)
    .map(r => {
      const target = targetsByOfficer[r.officer] || 0;
      const achievementPercent = target > 0 ? (r.achieved / target) * 100 : 0;
      return {
        ...r,
        target,
        achievementPercent: parseFloat(achievementPercent.toFixed(2))
      };
    });

  return result;
}

export function calculateProgress(target, actual) {
  return Math.min((actual / target) * 100, 100);
}

export function getLineWiseTotals(data) {
  const result = {};
  data.forEach(({ line, net_kg }) => {
    result[line] = (result[line] || 0) + parseFloat(net_kg || 0);
  });
  return result;
}
export function getTotalNetKgByLeafType(data) {
  const totals = {};

  data.forEach(({ leaf_type, net_kg }) => {
    if (!totals[leaf_type]) totals[leaf_type] = 0;
    totals[leaf_type] += net_kg;
  });

  // Round to 2 decimals
  for (let key in totals) {
    totals[key] = parseFloat(totals[key].toFixed(2));
  }

  return totals;
}



export function getMonthlyAchievementPercentagesByOfficer(data) {
  const result = {};

  data.forEach(({ month, field_officer, target, achieved }) => {
    const achievementPercent = target > 0 ? (achieved / target) * 100 : 0;
    const entry = {
      month,
      target,
      achieved,
      achievementPercent: parseFloat(achievementPercent.toFixed(2)),
    };

    if (!result[field_officer]) {
      result[field_officer] = [];
    }

    result[field_officer].push(entry);
  });

  return result;
}

export function getLeafTypeRatio(data) {
  const stats = { Super: 0, Normal: 0 };
  data.forEach(({ leaf_type, net_kg }) => {
    if (stats[leaf_type] !== undefined) stats[leaf_type] += parseFloat(net_kg || 0);
  });
  return stats;
}

export function getTopSuppliers(data, top = 10) {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totals = {};

  data.forEach(({ supplier_id, net_kg, date }) => {
    const recordDate = new Date(date);
    if (recordDate >= lastMonth && recordDate < thisMonth) {
      totals[supplier_id] = (totals[supplier_id] || 0) + parseFloat(net_kg || 0);
    }
  });

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([id, total]) => ({ supplier_id: id, total }));
}

export function getInactiveSuppliers(data, threshold = 6) {
  const today = new Date();
  const lastSeen = {};
  data.forEach(({ supplier_id, date }) => {
    const d = new Date(date);
    if (!lastSeen[supplier_id] || d > lastSeen[supplier_id]) {
      lastSeen[supplier_id] = d;
    }
  });
  return Object.entries(lastSeen)
    .filter(([_, lastDate]) => {
      const diff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      return diff > threshold;
    })
    .map(([id]) => id);
}

export function getSuppliersMarkedXOnDate(data) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDateStr = tomorrow.toDateString();

  const supplierMap = {};

  data.forEach(item => {
    if (!supplierMap[item.supplier_id]) {
      supplierMap[item.supplier_id] = [];
    }
    supplierMap[item.supplier_id].push(item);
  });

  const result = [];

  for (const supplierId in supplierMap) {
    const records = supplierMap[supplierId];
    const lastDate = new Date(Math.max(...records.map(r => new Date(r.date))));
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 6);

    if (nextDate.toDateString() === targetDateStr) {
      // Find the latest record to get the latest 'line' used
      const latestRecord = records.find(r => new Date(r.date).toDateString() === lastDate.toDateString());
      
      result.push({
        supplierId,
        line: latestRecord?.line || "Unknown"
      });
    }
  
    
  }

  return result;
}


export function getNewSuppliersThisMonth(data) {
  const thisMonth = new Date().toISOString().slice(0, 7);
  const seen = new Set();
  return data.filter(({ supplier_id, date }) => {
    if (!seen.has(supplier_id) && date.startsWith(thisMonth)) {
      seen.add(supplier_id);
      return true;
    }
    return false;
  }).map(d => d.supplier_id);
}
