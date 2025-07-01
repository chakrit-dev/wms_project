*** Settings ***
Library           SeleniumLibrary
Resource          ../resources/variables_register.robot
Resource          ../resources/utils.robot

Suite Setup       Open Browser    ${REGISTER_URL}    ${BROWSER}
Test Setup        Go To           ${REGISTER_URL}
Suite Teardown    Close Browser
Test Teardown     Capture Page Screenshot

*** Test Cases ***
TC-RE002 สมัครด้วยอีเมลซ้ำ
    [Documentation]    แสดง “Email already exists” เมื่อใช้อีเมลที่ลงทะเบียนแล้ว

    ${duplicate_email}=    Generate Unique Email
    ${username1}=          Generate Unique Username
    ${username2}=          Generate Unique Username

    # ✅ สมัครรอบแรก
    Go To    ${REGISTER_URL}
    Clear Local Storage
    Reload Page
    Wait Until Element Is Visible    xpath=//input[@placeholder='First Name']    timeout=10s
    Input Text    xpath=//input[@placeholder='First Name']           ${REGISTER_FIRSTNAME}
    Input Text    xpath=//input[@placeholder='Last Name']            ${REGISTER_LASTNAME}
    Input Text    xpath=//input[@placeholder='Phone Number']         ${REGISTER_PHONE}
    Input Text    xpath=//input[@placeholder='Valid Email Address']  ${duplicate_email}
    Input Text    xpath=//input[@placeholder='Create a Username']    ${username1}
    Input Text    xpath=//input[@placeholder='Create a Password']    ${REGISTER_PASSWORD}
    Input Text    xpath=//input[@placeholder='Confirm Password']     ${REGISTER_CONFIRM_PASS}
    Select From List By Label    xpath=//select                      ${REGISTER_ROLE}
    Click Button    xpath=//button[normalize-space()='Create Account']
    Wait Until Element Is Visible    xpath=//input[@placeholder='Username']    timeout=10s

    # ✅ สมัครซ้ำด้วยอีเมลเดิม
    Go To    ${REGISTER_URL}
    Clear Local Storage
    Reload Page
    Wait Until Element Is Visible    xpath=//input[@placeholder='First Name']    timeout=10s
    Input Text    xpath=//input[@placeholder='First Name']           ${REGISTER_FIRSTNAME}
    Input Text    xpath=//input[@placeholder='Last Name']            ${REGISTER_LASTNAME}
    Input Text    xpath=//input[@placeholder='Phone Number']         ${REGISTER_PHONE}
    Input Text    xpath=//input[@placeholder='Valid Email Address']  ${duplicate_email}
    Input Text    xpath=//input[@placeholder='Create a Username']    ${username2}
    Input Text    xpath=//input[@placeholder='Create a Password']    ${REGISTER_PASSWORD}
    Input Text    xpath=//input[@placeholder='Confirm Password']     ${REGISTER_CONFIRM_PASS}
    Select From List By Label    xpath=//select                      ${REGISTER_ROLE}
    Click Button    xpath=//button[normalize-space()='Create Account']

    # ✅ ตรวจสอบข้อความแจ้งเตือน
    Wait Until Element Contains    xpath=//div[@role="alert"]    email: Email already exists    timeout=10s


