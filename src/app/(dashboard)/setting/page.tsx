"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, Mail, User, Eye, EyeOff, Check, X, Edit, Trash2, Loader2 } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function SettingsPage() {
    const router = useRouter();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        confirmText: '',
        usernameText: '',
        reason: ''
    });

    // Fetch user data (simulated)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockUserData = {
                    username: 'devuser123',
                    email: 'user@example.com',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };

                setUserData(mockUserData);
            } catch (error) {
                toast.error('Failed to load user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Validate password strength
    useEffect(() => {
        if (isChangingPassword) {
            setPasswordRequirements({
                length: userData.newPassword.length >= 8,
                uppercase: /[A-Z]/.test(userData.newPassword),
                lowercase: /[a-z]/.test(userData.newPassword),
                number: /[0-9]/.test(userData.newPassword),
                specialChar: /[^A-Za-z0-9]/.test(userData.newPassword)
            });
        }
    }, [userData.newPassword, isChangingPassword]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleDeleteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDeleteConfirmation(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateUsername = async () => {
        if (!userData.username.trim()) {
            toast.error('Username cannot be empty');
            return;
        }

        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Username updated successfully');
            setIsEditingUsername(false);
        } catch (error) {
            toast.error('Failed to update username');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!userData.email.trim()) {
            toast.error('Email cannot be empty');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Email updated successfully');
            setIsEditingEmail(false);
        } catch (error) {
            toast.error('Failed to update email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!userData.currentPassword) {
            toast.error('Please enter your current password');
            return;
        }

        if (!userData.newPassword) {
            toast.error('Please enter a new password');
            return;
        }

        if (userData.newPassword !== userData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!Object.values(passwordRequirements).every(Boolean)) {
            toast.error('Password does not meet requirements');
            return;
        }

        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Password changed successfully');
            setIsChangingPassword(false);
            setUserData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            toast.error('Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation.confirmText !== 'delete my devspace account') {
            toast.error('Please type the exact confirmation phrase');
            return;
        }

        if (deleteConfirmation.usernameText !== `devspace.me/${userData.username}`) {
            toast.error('Please type your profile URL correctly');
            return;
        }

        if (!deleteConfirmation.reason.trim()) {
            toast.error('Please tell us why you\'re leaving');
            return;
        }

        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Account deleted successfully');
            router.push('/');
        } catch (error) {
            toast.error('Failed to delete account');
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    const passwordStrength = () => {
        const metRequirements = Object.values(passwordRequirements).filter(Boolean).length;
        const totalRequirements = Object.values(passwordRequirements).length;
        return (metRequirements / totalRequirements) * 100;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-cardDark">
                <Loader2 className="w-12 h-12 animate-spin text-primary/80" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-cardDark rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Manage your account information and security settings
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Username Section */}
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Username</h3>
                                    {isEditingUsername ? (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-secondaryText mr-2" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={userData.username}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 pl-10 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                    autoFocus
                                                />
                                            </div>
                                            <button
                                                onClick={handleUpdateUsername}
                                                disabled={!userData.username.trim()}
                                                className="p-2 text-green-500 hover:text-green-700 disabled:opacity-50 transition-colors"
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => setIsEditingUsername(false)}
                                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-gray-600 dark:text-gray-300">{userData.username}</p>
                                            <button
                                                onClick={() => setIsEditingUsername(true)}
                                                className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Email Section */}
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Address</h3>
                                    {isEditingEmail ? (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 pl-10 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                    autoFocus
                                                />
                                            </div>
                                            <button
                                                onClick={handleUpdateEmail}
                                                disabled={!userData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)}
                                                className="p-2 text-green-500 hover:text-green-700 disabled:opacity-50 transition-colors"
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => setIsEditingEmail(false)}
                                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-gray-600 dark:text-gray-300">{userData.email}</p>
                                            <button
                                                onClick={() => setIsEditingEmail(true)}
                                                className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Password</h3>

                            {isChangingPassword ? (
                                <div className="mt-4 space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={userData.currentPassword}
                                            onChange={handleInputChange}
                                            placeholder="Current Password"
                                            className="w-full px-4 py-2.5 pl-10 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={userData.newPassword}
                                            onChange={handleInputChange}
                                            placeholder="New Password"
                                            className="w-full px-4 py-2.5 pl-10 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={userData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm New Password"
                                            className="w-full px-4 py-2.5 pl-10 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Strength Meter */}
                                    <div className="mt-2">
                                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-300"
                                                style={{
                                                    width: `${passwordStrength()}%`,
                                                    backgroundColor: passwordStrength() >= 80 ? '#10B981' :
                                                        passwordStrength() >= 50 ? '#F59E0B' : '#EF4444'
                                                }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                {passwordRequirements.length ? (
                                                    <Check className="h-3 w-3 text-green-500 mr-1" />
                                                ) : (
                                                    <X className="h-3 w-3 text-red-500 mr-1" />
                                                )}
                                                <span>8+ characters</span>
                                            </div>
                                            <div className="flex items-center">
                                                {passwordRequirements.uppercase ? (
                                                    <Check className="h-3 w-3 text-green-500 mr-1" />
                                                ) : (
                                                    <X className="h-3 w-3 text-red-500 mr-1" />
                                                )}
                                                <span>Uppercase</span>
                                            </div>
                                            <div className="flex items-center">
                                                {passwordRequirements.lowercase ? (
                                                    <Check className="h-3 w-3 text-green-500 mr-1" />
                                                ) : (
                                                    <X className="h-3 w-3 text-red-500 mr-1" />
                                                )}
                                                <span>Lowercase</span>
                                            </div>
                                            <div className="flex items-center">
                                                {passwordRequirements.number ? (
                                                    <Check className="h-3 w-3 text-green-500 mr-1" />
                                                ) : (
                                                    <X className="h-3 w-3 text-red-500 mr-1" />
                                                )}
                                                <span>Number</span>
                                            </div>
                                            <div className="flex items-center">
                                                {passwordRequirements.specialChar ? (
                                                    <Check className="h-3 w-3 text-green-500 mr-1" />
                                                ) : (
                                                    <X className="h-3 w-3 text-red-500 mr-1" />
                                                )}
                                                <span>Special char</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsChangingPassword(false)}
                                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleChangePassword}
                                            disabled={
                                                !userData.currentPassword ||
                                                !userData.newPassword ||
                                                userData.newPassword !== userData.confirmPassword ||
                                                !Object.values(passwordRequirements).every(Boolean)
                                            }
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Change Password
                                </button>
                            )}
                        </div>

                        {/* Danger Zone */}
                        <div className="p-6 bg-red-50 dark:bg-red-900/10">
                            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Danger Zone</h3>
                            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                                These actions are irreversible. Proceed with caution.
                            </p>
                            <div className="mt-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            <Transition appear show={isDeleteModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-cardDark p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                                    >
                                        Delete Your Account
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            This will permanently delete your account and all associated data. This action cannot be undone.
                                        </p>

                                        <div className="mt-6 space-y-4">
                                            <div>
                                                <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Type <span className="font-bold">&quot;delete my devspace account&quot;</span> to confirm
                                                </label>
                                                <input
                                                    type="text"
                                                    id="confirmText"
                                                    name="confirmText"
                                                    value={deleteConfirmation.confirmText}
                                                    onChange={handleDeleteInputChange}
                                                    className="w-full px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                    placeholder="delete my devspace account"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="usernameText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Type your profile URL to confirm
                                                </label>
                                                <input
                                                    type="text"
                                                    id="usernameText"
                                                    name="usernameText"
                                                    value={deleteConfirmation.usernameText}
                                                    onChange={handleDeleteInputChange}
                                                    className="w-full px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                    placeholder={`devspace.me/${userData.username}`}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Reason for leaving (optional but appreciated)
                                                </label>
                                                <textarea
                                                    id="reason"
                                                    name="reason"
                                                    value={deleteConfirmation.reason}
                                                    onChange={handleDeleteInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                    placeholder="What could we have done better?"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            onClick={() => setIsDeleteModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={handleDeleteAccount}
                                            disabled={
                                                deleteConfirmation.confirmText !== 'delete my devspace account' ||
                                                deleteConfirmation.usernameText !== `devspace.me/${userData.username}`
                                            }
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}