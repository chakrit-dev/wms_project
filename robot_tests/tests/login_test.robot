*** Settings ***
Library           SeleniumLibrary
Resource   ../resources/variables_user.robot
Suite Setup       Open Browser    ${LOGIN_URL}    ${BROWSER}
Test Setup        Go To    ${LOGIN_URL}
Suite Teardown    Close Browser

Test Teardown     Capture Page Screenshot

*** Test Cases ***

TC-LI001 Login ด้วย Username และ Password ที่ถูกต้อง
    [Documentation]    Login successful and redirected to /dashboard
    Input Text    xpath=//input[@placeholder='Username']    ${VALID_USERNAME}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${VALID_PASSWORD}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains Element    xpath=//aside    timeout=10s

TC-LI002 Username ถูก/Password ผิด
    [Documentation]    Displays error message: 'Incorrect username or password.'
    Input Text    xpath=//input[@placeholder='Username']    ${VALID_USERNAME}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${INVALID_PASSWORD}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    Incorrect username or password.    timeout=5s

TC-LI003 Username ผิด / Password ถูก
    [Documentation]    Displays error message: 'Incorrect username or password'
    Input Text    xpath=//input[@placeholder='Username']    ${INVALID_USERNAME}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${VALID_PASSWORD}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    Incorrect username or password.    timeout=5s

TC-LI004 Redirect ผิด (URL ไม่ถูกต้อง)
    [Documentation]    แสดงหน้า 404 Page Not Found
    Go To    ${LOGIN_URL}/invalid-path
    Wait Until Page Contains    Oops! Page Not Found    timeout=5s

TC-LI005 Username เป็นช่องว่าง
    [Documentation]    Displays validation: 'Username must be at least 4 characters'
    Input Text    xpath=//input[@placeholder='Username']    ${EMPTY_STRING}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${VALID_PASSWORD}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    ${MSG_SHORT_USERNAME}    timeout=5s

TC-LI006 Password เป็นช่องว่าง
    [Documentation]    Displays validation: 'Password must be at least 6 characters.'
    Input Text    xpath=//input[@placeholder='Username']    ${VALID_USERNAME}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${EMPTY_STRING}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    ${MSG_SHORT_PASSWORD}    timeout=5s

TC-LI007 กรอกทั้ง Username และ Password เป็นช่องว่าง
    [Documentation]    Displays validation for both empty fields
    Input Text    xpath=//input[@placeholder='Username']    ${EMPTY_STRING}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${EMPTY_STRING}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    ${MSG_SHORT_USERNAME}    timeout=5s
    Page Should Contain         ${MSG_SHORT_PASSWORD}

TC-LI008 Username อักษร < 4 ตัว
    [Documentation]    Username must be at least 4 characters
    Input Text    xpath=//input[@placeholder='Username']    ${SHORT_USERNAME}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${VALID_PASSWORD}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    ${MSG_SHORT_USERNAME}    timeout=5s

TC-LI009 Password ความยาว < 6 ตัว
    [Documentation]    Password must be at least 6 characters
    Input Text    xpath=//input[@placeholder='Username']    ${VALID_USERNAME}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${SHORT_PASSWORD}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    ${MSG_SHORT_PASSWORD}    timeout=5s

TC-LI010 Login ด้วย Script Injection
    [Documentation]    ระบบป้องกัน XSS และแสดง “Incorrect Username or Password”
    Input Text    xpath=//input[@placeholder='Username']    ${SCRIPT_INJECTION}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${FAKE_PASSWORD}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    Incorrect username or password.    timeout=5s

TC-LI011 Login ด้วย SQL Injection
    [Documentation]    ระบบป้องกัน SQL Injection และแสดง “Incorrect Username or Password”
    Input Text    xpath=//input[@placeholder='Username']    ${SQL_INJECTION}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${FAKE_PASSWORD}
    Click Button  xpath=//button[normalize-space(text())='Login']
    Wait Until Page Contains    Incorrect username or password.    timeout=5s

TC-LI012 Login แล้วกดปุ่ม Enter แทนคลิก login
    [Documentation]    ต้องเข้าสู่ระบบได้เหมือนกดปุ่ม Login
    Input Text    xpath=//input[@placeholder='Username']    ${VALID_USERNAME}
    Input Text    xpath=//input[@placeholder='Enter your password']    ${VALID_PASSWORD}
    Press Keys    xpath=//input[@placeholder='Enter your password']    Enter
    Wait Until Page Contains    SmartLogiX    timeout=10s

