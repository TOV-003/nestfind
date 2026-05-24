import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

function UserIDName({ userId }) {
    const [name, setName] = useState('Loading...');

    useEffect(function () {
        async function fetchName() {
            const { data } = await supabase
                .from('users')
                .select('name')
                .eq('id', userId)
                .single();

            if (data) {
                setName(data.name);
            } else {
                setName('Unknown User');
            }
        }
        fetchName();
    }, [userId]);

    return <span>{name}</span>;
}

export default UserIDName;