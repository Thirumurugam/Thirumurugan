import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';

export const NotificationModal = () => {
  const { modals, closeModal, notifications, markAllNotificationsAsRead, unreadNotificationsCount, t } = useApp();

  if (!modals.notifications) return null;

  return (
    <div className="modal-overlay" onClick={() => closeModal('notifications')}>
      <div className="modal-content notification-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="notif-title">
        <div className="modal-header">
          <div className="title-with-icon">
            <div className="icon-badge blue">
              <Bell size={22} />
            </div>
            <div>
              <h2 id="notif-title">{t('notificationsTitle')}</h2>
              <span className="subtitle-badge">{unreadNotificationsCount} Unread</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => closeModal('notifications')} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {notifications.length > 0 && (
            <div className="notif-actions-bar">
              <button className="text-action-btn" onClick={markAllNotificationsAsRead}>
                ✓ {t('markAllRead')}
              </button>
            </div>
          )}

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={40} className="empty-icon" />
                <p>{t('noNotifications')}</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                  <div className="notif-icon-col">
                    {notif.type === 'appointment_confirmed' && <CheckCircle2 size={20} className="text-emerald-500" />}
                    {notif.type === 'medicine_reminder' && <Clock size={20} className="text-blue-500" />}
                    {notif.type === 'payment_success' && <CheckCircle2 size={20} className="text-purple-500" />}
                    {notif.type !== 'appointment_confirmed' && notif.type !== 'medicine_reminder' && notif.type !== 'payment_success' && (
                      <AlertCircle size={20} className="text-amber-500" />
                    )}
                  </div>
                  <div className="notif-content-col">
                    <div className="notif-header-line">
                      <h4>{notif.title}</h4>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                    <p className="notif-message">{notif.message}</p>
                  </div>
                  {notif.unread && <span className="unread-dot" title="Unread"></span>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-btn full-width" onClick={() => closeModal('notifications')}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
