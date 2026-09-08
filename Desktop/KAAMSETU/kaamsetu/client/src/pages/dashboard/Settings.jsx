import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Lock, Shield } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function Settings() {
    const { user, updateUser } = useAuth();
    const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const saveProfile = async () => {
        if (!profileForm.name.trim()) return toast.error('Name is required');
        setSavingProfile(true);
        try {
            const res = await api.put('/auth/profile', profileForm);
            updateUser(res.data.data.user);
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setSavingProfile(false);
        }
    };

    const savePassword = async () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
            return toast.error('All password fields are required');
        }
        if (passwordForm.newPassword.length < 8) {
            return toast.error('New password must be at least 8 characters');
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setSavingPassword(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success('Password changed successfully');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
            </div>

            {/* Profile */}
            <div className="card space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
                        <User size={17} className="text-primary-600" />
                    </div>
                    <h2 className="font-bold text-gray-900">Profile Information</h2>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                    <span className="font-medium">Email: </span>{user?.email}
                    <span className="text-gray-400 ml-2 text-xs">(cannot be changed)</span>
                </div>
                <Input
                    label="Full Name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                />
                <Input
                    label="Phone Number"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="9876543210"
                />
                <Button onClick={saveProfile} loading={savingProfile}>Save Profile</Button>
            </div>

            {/* Change password */}
            <div className="card space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Lock size={17} className="text-orange-600" />
                    </div>
                    <h2 className="font-bold text-gray-900">Change Password</h2>
                </div>
                <Input
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                <Input
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    hint="Minimum 8 characters"
                />
                <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
                <Button onClick={savePassword} loading={savingPassword} variant="secondary">
                    Change Password
                </Button>
            </div>

            {/* Account info */}
            <div className="card">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Shield size={17} className="text-blue-600" />
                    </div>
                    <h2 className="font-bold text-gray-900">Account Details</h2>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Role</span>
                        <span className="font-semibold text-gray-900 capitalize">{user?.role}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Member since</span>
                        <span className="font-semibold text-gray-900">
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                                : '—'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-500">Account status</span>
                        <span className="badge-green">Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
