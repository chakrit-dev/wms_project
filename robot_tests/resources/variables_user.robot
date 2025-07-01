*** Variables ***
${LOGIN_URL}           http://localhost:5173/login
${BROWSER}             chrome

# Valid Credentials
${VALID_USERNAME}      chakrit
${VALID_PASSWORD}      666666


# Invalid Credentials
${INVALID_USERNAME}    chakri
${INVALID_PASSWORD}    123456

# Empty Inputs
${EMPTY_STRING}        ${EMPTY}

# Short Inputs (validation failure)
${SHORT_USERNAME}      cha
${SHORT_PASSWORD}      123

# Injection Inputs
${SCRIPT_INJECTION}    <script>alert('x')</script>
${SQL_INJECTION}       ' OR 1=1 --

# Fake Password for injection case
${FAKE_PASSWORD}      fakepass123

# Expected Messages (you can reuse these in assertions if needed)
${MSG_INVALID_CREDENTIALS}     Incorrect Username or Password.
${MSG_SHORT_USERNAME}          Username must be at least 4 characters
${MSG_SHORT_PASSWORD}          Password must be at least 6 characters
${MSG_REQUIRED_USERNAME}       Username is required
${MSG_REQUIRED_PASSWORD}       Password is required
${MSG_404}                     404 Page Not Found
${MSG_DASHBOARD}               Dashboard



