const username_to_disName = (username) => {
    username = username.split('@')
    username = username[0].replace(/[0-9]/g, '');
    const first_step = username.split('.');
    const firstname = first_step[0][0].toUpperCase() + first_step[0].substr(1);
    const lastname = first_step[1][0].toUpperCase() + first_step[1].substr(1);

    return (firstname + ' ' + lastname);
}

export {username_to_disName};