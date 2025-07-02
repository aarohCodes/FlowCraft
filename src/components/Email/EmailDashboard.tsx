import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Send, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  Eye,
  Trash2,
  Plus,
  Users,
  Calendar,
  Zap,
  RefreshCw,
  Settings,
  Filter
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Email } from '../../types';
import { gmailApi } from '../../services/gmailApi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export const EmailDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState({ subject: '', body: '', recipients: [] as string[] });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'sent'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = () => {
    // Load emails from app state
    setEmails(state.emails);
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'all') return true;
    return email.status === filter || (filter === 'pending' && email.status === 'pending_approval');
  });

  const handleApprove = async (emailId: string) => {
    setLoading(true);
    try {
      const email = emails.find(e => e.id === emailId);
      if (!email) return;

      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmails(prev => prev.map(e => 
        e.id === emailId ? { ...e, status: 'sent' as const } : e
      ));
      
      toast.success('Email sent successfully!');
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (email: Email) => {
    setSelectedEmail(email);
    setEditedContent({
      subject: email.subject,
      body: email.body,
      recipients: email.recipients
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedEmail) return;

    setEmails(prev => prev.map(e => 
      e.id === selectedEmail.id 
        ? { 
            ...e, 
            subject: editedContent.subject,
            body: editedContent.body,
            recipients: editedContent.recipients,
            editHistory: [
              ...(e.editHistory || []),
              { timestamp: new Date(), changes: 'Email content updated' }
            ]
          }
        : e
    ));

    setIsEditing(false);
    setSelectedEmail(null);
    toast.success('Email updated successfully!');
  };

  const handleReject = (emailId: string) => {
    setEmails(prev => prev.filter(e => e.id !== emailId));
    toast.success('Email rejected and deleted');
  };

  const generateEmailsFromMeeting = async () => {
    setLoading(true);
    try {
      // Simulate AI email generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newEmail: Email = {
        id: Date.now().toString(),
        subject: 'Follow-up: Weekly Team Sync',
        body: `Hi team,

Thank you for joining today's weekly sync.

Key Discussion Points:
• Sprint progress review
• Upcoming deadlines
• Resource allocation

Action Items:
• Complete pending code reviews
• Update project timeline
• Prepare demo for stakeholders

Let me know if you have any questions.

Best regards,
[Your Name]`,
        recipients: ['team@company.com'],
        status: 'pending_approval',
        priority: 'medium',
        emailType: 'meeting_summary',
        generatedAt: new Date(),
        aiGenerated: true
      };

      setEmails(prev => [newEmail, ...prev]);
      toast.success('New email generated from meeting!');
    } catch (error) {
      toast.error('Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Email['status']) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: Email['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getEmailTypeIcon = (type: Email['emailType']) => {
    switch (type) {
      case 'meeting_summary': return Calendar;
      case 'action_items': return AlertCircle;
      case 'thank_you': return Users;
      case 'follow_up': return RefreshCw;
      case 'reminder': return Clock;
      default: return Mail;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Email Assistant
        </h2>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateEmailsFromMeeting}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50"
          >
            <Zap size={16} />
            <span>{loading ? 'Generating...' : 'Generate from Meeting'}</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.filter(e => e.status === 'pending_approval').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sent Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.filter(e => e.status === 'sent').length}
              </p>
            </div>
            <Send className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.filter(e => e.aiGenerated).length}
              </p>
            </div>
            <Zap className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Emails</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{emails.length}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center space-x-4">
          <Filter size={16} className="text-gray-400" />
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Emails' },
              { key: 'pending', label: 'Pending Approval' },
              { key: 'sent', label: 'Sent' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredEmails.map((email, index) => {
            const TypeIcon = getEmailTypeIcon(email.emailType);
            return (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <TypeIcon size={20} className="text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {email.subject}
                        </h3>
                        {email.aiGenerated && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full text-xs font-medium">
                            AI Generated
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>To: {email.recipients.join(', ')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertCircle size={14} className={getPriorityColor(email.priority)} />
                          <span className="capitalize">{email.priority} priority</span>
                        </div>
                        <span>{formatDistanceToNow(email.generatedAt, { addSuffix: true })}</span>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {email.body}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                      {email.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEmail(email)}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </motion.button>

                    {email.status === 'pending_approval' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(email)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(email.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </motion.button>
                      </>
                    )}
                  </div>

                  {email.status === 'pending_approval' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(email.id)}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      <Check size={14} />
                      <span>Approve & Send</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredEmails.length === 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg text-center">
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No emails found. Generate emails from your meetings to get started!
            </p>
          </div>
        )}
      </div>

      {/* Email Preview/Edit Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedEmail(null);
                setIsEditing(false);
              }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Email' : 'Email Preview'}
                </h3>
                <div className="flex items-center space-x-2">
                  {!isEditing && selectedEmail.status === 'pending_approval' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(selectedEmail)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </motion.button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedEmail(null);
                      setIsEditing(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recipients
                      </label>
                      <input
                        type="text"
                        value={editedContent.recipients.join(', ')}
                        onChange={(e) => setEditedContent({
                          ...editedContent,
                          recipients: e.target.value.split(',').map(email => email.trim())
                        })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={editedContent.subject}
                        onChange={(e) => setEditedContent({ ...editedContent, subject: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Body
                      </label>
                      <textarea
                        value={editedContent.body}
                        onChange={(e) => setEditedContent({ ...editedContent, body: e.target.value })}
                        rows={15}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">To:</span>
                        <p className="text-gray-900 dark:text-white">{selectedEmail.recipients.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                        <p className={`capitalize font-medium ${getPriorityColor(selectedEmail.priority)}`}>
                          {selectedEmail.priority}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedEmail.subject}
                      </h4>
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans">
                        {selectedEmail.body}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveEdit}
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Save Changes
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};