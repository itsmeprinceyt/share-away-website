"use client";
import useRedirectToProfile from '../../hooks/useRedirectToProfile';
import Loading from '../(components)/Loading';

/**
 * @description     - This page is used to redirect the user to their profile page.
 */
export default function ProfilePage() {
    useRedirectToProfile();
    return (
        <Loading />
    );
}
