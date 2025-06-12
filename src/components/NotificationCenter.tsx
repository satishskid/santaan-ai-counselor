import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  X,
  Mail,
  FileText,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Star,
  BookOpen,
  Users,
  Calendar,
  Download,
  Eye
} from "lucide-react";

interface Notification {
  id: number;
  type: "newsletter" | "content" | "system" | "reminder";
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: "low" | "normal" | "high" | "urgent";
  actionUrl?: string;
  actionText?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "newsletter",
      title: "Monthly Training Update - January 2024",
      message: "New ESHRE guidelines and training materials are now available. Review the latest updates to stay current with best practices.",
      date: "2024-01-15",
      read: false,
      priority: "high",
      actionUrl: "/resources",
      actionText: "View Resources"
    },
    {
      id: 2,
      type: "content",
      title: "New Training Module: Advanced IVF Counseling",
      message: "A comprehensive new training module covering advanced IVF counseling techniques has been added to your training library.",
      date: "2024-01-14",
      read: false,
      priority: "normal",
      actionUrl: "/resources",
      actionText: "Start Training"
    },
    {
      id: 3,
      type: "system",
      title: "Platform Maintenance Scheduled",
      message: "Scheduled maintenance will occur on January 20th from 2:00 AM to 4:00 AM EST. The platform will be temporarily unavailable.",
      date: "2024-01-13",
      read: true,
      priority: "normal"
    },
    {
      id: 4,
      type: "reminder",
      title: "Training Module Completion Reminder",
      message: "You have 2 incomplete training modules. Complete them to maintain your certification status.",
      date: "2024-01-12",
      read: false,
      priority: "urgent",
      actionUrl: "/resources",
      actionText: "Complete Training"
    },
    {
      id: 5,
      type: "content",
      title: "Updated PCOS Treatment Guidelines",
      message: "The PCOS treatment guidelines have been updated with the latest research findings and treatment protocols.",
      date: "2024-01-11",
      read: true,
      priority: "high",
      actionUrl: "/resources",
      actionText: "Read Update"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "newsletter": return Mail;
      case "content": return BookOpen;
      case "system": return Info;
      case "reminder": return AlertCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "urgent") return "text-red-600 bg-red-100";
    if (priority === "high") return "text-orange-600 bg-orange-100";
    
    switch (type) {
      case "newsletter": return "text-blue-600 bg-blue-100";
      case "content": return "text-green-600 bg-green-100";
      case "system": return "text-purple-600 bg-purple-100";
      case "reminder": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return <Badge className="bg-red-100 text-red-700 border-red-200">Urgent</Badge>;
      case "high": return <Badge className="bg-orange-100 text-orange-700 border-orange-200">High</Badge>;
      case "normal": return null;
      case "low": return <Badge variant="outline">Low</Badge>;
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50 pt-16 pr-6">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-santaan-primary" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-santaan-secondary text-white">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type, notification.priority);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-accent/50 transition-colors ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={`font-medium text-sm ${!notification.read ? "font-semibold" : ""}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-santaan-primary rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {notification.date}
                                  </span>
                                  {getPriorityBadge(notification.priority)}
                                </div>
                                <div className="flex items-center space-x-1">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => markAsRead(notification.id)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      Mark read
                                    </Button>
                                  )}
                                  {notification.actionUrl && (
                                    <Button
                                      size="sm"
                                      className="h-6 px-2 text-xs bg-santaan-primary hover:bg-santaan-primary/90"
                                      onClick={() => {
                                        markAsRead(notification.id);
                                        // Navigate to action URL
                                        window.location.href = notification.actionUrl!;
                                      }}
                                    >
                                      {notification.actionText}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t bg-accent/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {notifications.length} total notifications
                </span>
                <Button variant="ghost" size="sm" className="text-santaan-primary">
                  View all notifications
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
