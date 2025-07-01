*** Keywords ***
Generate Unique Email
    ${timestamp}=    Get Time    epoch
    ${email}=        Set Variable    testuser.${timestamp}@wms.com
    RETURN    ${email}

Generate Unique Username
    ${timestamp}=    Get Time    epoch
    ${username}=     Set Variable    user${timestamp}
    RETURN    ${username}


Clear Local Storage
    Execute Javascript    window.localStorage.clear()
