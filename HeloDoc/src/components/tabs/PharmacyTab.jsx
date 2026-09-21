import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package, CheckCircle, XCircle, AlertTriangle, Clock, Truck,
  Search, ChevronRight, RefreshCw, Bell, User, Pill, ChevronDown,
  ShieldCheck, AlertCircle, Phone, Hash
} from 'lucide-react';

const DEMO_ORDERS = [
  {
    id: 'RX-2001', orderId: 'ORD-MED-2001', patientName: 'Ramachandran V', patientAge: 67,
    doctor: 'Dr. Priya Nair', department: 'Cardiology', room: 'Room 201',
    phone: '+91 98765 43210', receivedAt: '09:15 AM',
    medicines: [
      { name: 'Amlodipine 5mg', qty: 30, available: true },
      { name: 'Metoprolol 25mg', qty: 60, available: true },
      { name: 'Atorvastatin 10mg', qty: 30, available: false, substitute: 'Rosuvastatin 10mg' }
    ],
    status: 'pending', priority: 'high', deliveryType: 'home'
  },
  {
    id: 'RX-2002', orderId: 'ORD-MED-2002', patientName: 'Meenakshi S', patientAge: 52,
    doctor: 'Dr. Rajesh Kumar', department: 'Orthopedics', room: 'Room 104',
    phone: '+91 94321 56789', receivedAt: '09:42 AM',
    medicines: [
      { name: 'Diclofenac 50mg', qty: 20, available: true },
      { name: 'Pantoprazole 40mg', qty: 20, available: true },
      { name: 'Calcium + D3 Tablet', qty: 60, available: true }
    ],
    status: 'preparing', priority: 'normal', deliveryType: 'counter'
  },
  {
    id: 'RX-2003', orderId: 'ORD-MED-2003', patientName: 'Vikram T', patientAge: 38,
    doctor: 'Dr. Ananya Singh', department: 'General Medicine', room: 'Room 302',
    phone: '+91 77654 32109', receivedAt: '10:05 AM',
    medicines: [
      { name: 'Azithromycin 500mg', qty: 5, available: true },
      { name: 'Paracetamol 650mg', qty: 10, available: true }
    ],
    status: 'ready', priority: 'normal', deliveryType: 'home'
  },
  {
    id: 'RX-2004', orderId: 'ORD-MED-2004', patientName: 'Lakshmi R', patientAge: 74,
    doctor: 'Dr. Suresh Babu', department: 'Neurology', room: 'Room 505',
    phone: '+91 99001 23456', receivedAt: '10:30 AM',
    medicines: [
      { name: 'Levetiracetam 500mg', qty: 60, available: true },
      { name: 'Folic Acid 5mg', qty: 30, available: true },
      { name: 'Clobazam 10mg', qty: 30, available: true }
    ],
    status: 'dispatched', priority: 'high', deliveryType: 'home'
  }
];

const STATUS_CONFIG = {
  pending:    { label: 'Pending Review',   color: '#f59e0b', bg: '#fef3c7', icon: Clock },
  preparing:  { label: 'Preparing Order',  color: '#3b82f6', bg: '#dbeafe', icon: Package },
  ready:      { label: 'Ready for Pickup', color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
  dispatched: { label: 'Out for Delivery', color: '#8b5cf6', bg: '#ede9fe', icon: Truck },
  delivered:  { label: 'Delivered',        color: '#6b7280', bg: '#f3f4f6', icon: ShieldCheck }
};

const NEXT_STATUS = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'dispatched',
  dispatched: 'delivered'
};

export const PharmacyTab = () => {
  const { triggerDynamicIsland, addNotification, t } = useApp();
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [substituteModal, setSubstituteModal] = useState(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const advanceStatus = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && NEXT_STATUS[o.status]) {
        const nextStatus = NEXT_STATUS[o.status];
        triggerDynamicIsland(`Order ${orderId}: ${STATUS_CONFIG[nextStatus].label} ✓`);
        addNotification({
          title: `Pharmacy: Order ${orderId} Updated`,
          message: `Status changed to "${STATUS_CONFIG[nextStatus].label}"`,
          type: 'medicine_reminder'
        });
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const approveSubstitute = (orderId, medName, substitute) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          medicines: o.medicines.map(m =>
            m.name === medName ? { ...m, name: substitute, available: true, substituted: true, originalName: medName } : m
          )
        };
      }
      return o;
    }));
    setSubstituteModal(null);
    triggerDynamicIsland('Substitution Approved ✓');
    addNotification({
      title: 'Medicine Substitution Approved',
      message: `${medName} substituted with ${substitute} pending patient/doctor approval.`,
      type: 'medicine_reminder'
    });
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="pharmacy-tab-container">
      {/* Header */}
      <div className="pharmacy-header-card">
        <div className="pharmacy-header-left">
          <div className="pharmacy-icon-wrap">🏥</div>
          <div>
            <h2>Pharmacy Dashboard</h2>
            <p className="pharmacy-subtitle">Jan Aushadhi Kendra — Room 004</p>
          </div>
        </div>
        <div className="pharmacy-header-stats">
          {pendingCount > 0 && (
            <div className="pharmacy-alert-badge">
              <Bell size={14} />
              <span>{pendingCount} Pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="pharmacy-stats-row">
        {[
          { label: 'Total Orders', value: orders.length, emoji: '📋' },
          { label: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, emoji: '⚗️' },
          { label: 'Ready', value: orders.filter(o => o.status === 'ready').length, emoji: '✅' },
          { label: 'Out for Delivery', value: orders.filter(o => o.status === 'dispatched').length, emoji: '🛵' }
        ].map((stat, i) => (
          <div key={i} className="pharmacy-stat-card">
            <span className="pharmacy-stat-emoji">{stat.emoji}</span>
            <span className="pharmacy-stat-value">{stat.value}</span>
            <span className="pharmacy-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="pharmacy-search-bar">
        <div className="pharmacy-search-input-wrap">
          <Search size={16} className="pharmacy-search-icon" />
          <input
            type="text"
            placeholder="Search by patient name or order ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pharmacy-search-input"
          />
        </div>
        <div className="pharmacy-filter-pills">
          {['all', 'pending', 'preparing', 'ready', 'dispatched', 'delivered'].map(f => (
            <button
              key={f}
              className={`pharmacy-filter-pill ${filterStatus === f ? 'active' : ''}`}
              onClick={() => setFilterStatus(f)}
            >
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label?.split(' ')[0] || f}
            </button>
          ))}
        </div>
      </div>

      {/* Order Queue */}
      <div className="pharmacy-order-list">
        {filtered.length === 0 && (
          <div className="pharmacy-empty-state">
            <Package size={40} className="pharmacy-empty-icon" />
            <p>No orders found</p>
          </div>
        )}
        {filtered.map(order => {
          const sc = STATUS_CONFIG[order.status];
          const StatusIcon = sc.icon;
          const isExpanded = expandedOrder === order.id;
          const hasUnavailable = order.medicines.some(m => !m.available);

          return (
            <div
              key={order.id}
              className={`pharmacy-order-card ${order.priority === 'high' ? 'priority-high' : ''}`}
            >
              {/* Order Header */}
              <div
                className="pharmacy-order-header"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="pharmacy-order-left">
                  <div className="pharmacy-order-id">
                    <Hash size={12} />
                    <span>{order.id}</span>
                    {order.priority === 'high' && (
                      <span className="pharmacy-priority-badge">⚡ Priority</span>
                    )}
                  </div>
                  <div className="pharmacy-patient-name">{order.patientName}</div>
                  <div className="pharmacy-order-meta">
                    <span>👨‍⚕️ {order.doctor}</span>
                    <span>•</span>
                    <span>{order.deliveryType === 'home' ? '🚚 Home Delivery' : '🏥 Counter Pickup'}</span>
                    <span>•</span>
                    <span>🕐 {order.receivedAt}</span>
                  </div>
                </div>
                <div className="pharmacy-order-right">
                  <div className="pharmacy-status-pill" style={{ background: sc.bg, color: sc.color }}>
                    <StatusIcon size={12} />
                    <span>{sc.label}</span>
                  </div>
                  {hasUnavailable && (
                    <div className="pharmacy-stock-alert">
                      <AlertTriangle size={12} />
                      <span>Stock Issue</span>
                    </div>
                  )}
                  <ChevronDown
                    size={16}
                    className={`pharmacy-chevron ${isExpanded ? 'rotated' : ''}`}
                    style={{ color: '#6b7280' }}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="pharmacy-order-body">
                  {/* Patient Info */}
                  <div className="pharmacy-patient-info-row">
                    <div className="pharmacy-info-chip">
                      <User size={13} />
                      <span>{order.patientName}, {order.patientAge}y</span>
                    </div>
                    <div className="pharmacy-info-chip">
                      <Phone size={13} />
                      <span>{order.phone}</span>
                    </div>
                    <div className="pharmacy-info-chip">
                      <Hash size={13} />
                      <span>{order.room}</span>
                    </div>
                  </div>

                  {/* Medicines List */}
                  <div className="pharmacy-medicines-section">
                    <h4 className="pharmacy-section-title">
                      <Pill size={14} />
                      Prescribed Medicines
                    </h4>
                    <div className="pharmacy-medicine-list">
                      {order.medicines.map((med, i) => (
                        <div key={i} className={`pharmacy-medicine-row ${!med.available ? 'unavailable' : ''}`}>
                          <div className="pharmacy-medicine-left">
                            <div className={`pharmacy-med-dot ${med.available ? 'green' : 'red'}`} />
                            <div>
                              <div className="pharmacy-med-name">
                                {med.name}
                                {med.substituted && (
                                  <span className="pharmacy-substituted-badge">Substituted</span>
                                )}
                              </div>
                              {med.originalName && (
                                <div className="pharmacy-original-name">Original: {med.originalName}</div>
                              )}
                            </div>
                          </div>
                          <div className="pharmacy-medicine-right">
                            <span className="pharmacy-med-qty">Qty: {med.qty}</span>
                            {!med.available && !med.substituted && (
                              <button
                                className="pharmacy-substitute-btn"
                                onClick={() => setSubstituteModal({ orderId: order.id, med })}
                              >
                                <RefreshCw size={12} />
                                Substitute
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pharmacy-action-row">
                    {order.status !== 'delivered' && (
                      <button
                        className="pharmacy-advance-btn"
                        onClick={() => advanceStatus(order.id)}
                        disabled={hasUnavailable && order.status === 'pending'}
                      >
                        <ChevronRight size={16} />
                        {order.status === 'pending' && 'Start Preparing'}
                        {order.status === 'preparing' && 'Mark Ready'}
                        {order.status === 'ready' && 'Dispatch for Delivery'}
                        {order.status === 'dispatched' && 'Confirm Delivered'}
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <div className="pharmacy-delivered-badge">
                        <CheckCircle size={16} />
                        Order Completed
                      </div>
                    )}
                    {hasUnavailable && order.status === 'pending' && (
                      <p className="pharmacy-blocked-note">
                        <AlertCircle size={13} />
                        Resolve stock issues before preparing
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Substitution Modal */}
      {substituteModal && (
        <div className="pharmacy-modal-overlay" onClick={() => setSubstituteModal(null)}>
          <div className="pharmacy-sub-modal" onClick={e => e.stopPropagation()}>
            <div className="pharmacy-sub-modal-header">
              <RefreshCw size={20} className="text-amber-500" />
              <h3>Medicine Substitution</h3>
            </div>
            <div className="pharmacy-sub-body">
              <div className="pharmacy-sub-original">
                <span className="pharmacy-sub-label">Prescribed:</span>
                <span className="pharmacy-sub-med">{substituteModal.med.name}</span>
                <span className="pharmacy-unavail-tag">Out of Stock</span>
              </div>
              <div className="pharmacy-sub-arrow">↓</div>
              <div className="pharmacy-sub-suggested">
                <span className="pharmacy-sub-label">Suggested Substitute:</span>
                <span className="pharmacy-sub-med green">{substituteModal.med.substitute || 'Generic Equivalent'}</span>
              </div>
              <div className="pharmacy-sub-warning">
                <AlertTriangle size={14} className="text-amber-500" />
                <p>Patient and prescribing doctor must be notified before dispensing a substitute. Proceed only with authorization.</p>
              </div>
            </div>
            <div className="pharmacy-sub-actions">
              <button
                className="pharmacy-sub-approve-btn"
                onClick={() => approveSubstitute(substituteModal.orderId, substituteModal.med.name, substituteModal.med.substitute || 'Generic Equivalent')}
              >
                ✓ Approve Substitution
              </button>
              <button className="pharmacy-sub-cancel-btn" onClick={() => setSubstituteModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
