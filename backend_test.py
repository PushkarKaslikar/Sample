#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import uuid

class EduGateAPITester:
    def __init__(self, base_url="https://edugate.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.student_token = None
        self.teacher_token = None
        self.student_user = None
        self.teacher_user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_detail = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_response = response.json()
                    if 'detail' in error_response:
                        error_detail += f" - {error_response['detail']}"
                except:
                    error_detail += f" - {response.text[:100]}"
                
                self.log_test(name, False, error_detail)
                return False, {}

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_student_registration(self):
        """Test student registration"""
        test_email = f"student_{uuid.uuid4().hex[:8]}@test.com"
        test_data = {
            "name": "Test Student",
            "email": test_email,
            "password": "TestPass123!",
            "role": "student"
        }
        
        success, response = self.run_test(
            "Student Registration",
            "POST",
            "auth/register",
            200,
            data=test_data
        )
        
        if success and 'access_token' in response:
            self.student_token = response['access_token']
            self.student_user = response['user']
            return True
        return False

    def test_teacher_registration(self):
        """Test teacher registration"""
        test_email = f"teacher_{uuid.uuid4().hex[:8]}@test.com"
        test_data = {
            "name": "Test Teacher",
            "email": test_email,
            "password": "TestPass123!",
            "role": "teacher"
        }
        
        success, response = self.run_test(
            "Teacher Registration",
            "POST",
            "auth/register",
            200,
            data=test_data
        )
        
        if success and 'access_token' in response:
            self.teacher_token = response['access_token']
            self.teacher_user = response['user']
            return True
        return False

    def test_student_login(self):
        """Test student login with registered credentials"""
        if not self.student_user:
            self.log_test("Student Login", False, "No student user to test login")
            return False
            
        login_data = {
            "email": self.student_user['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "Student Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        return success and 'access_token' in response

    def test_teacher_login(self):
        """Test teacher login with registered credentials"""
        if not self.teacher_user:
            self.log_test("Teacher Login", False, "No teacher user to test login")
            return False
            
        login_data = {
            "email": self.teacher_user['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "Teacher Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        return success and 'access_token' in response

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_data = {
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        }
        
        success, _ = self.run_test(
            "Invalid Login (Should Fail)",
            "POST",
            "auth/login",
            401,
            data=invalid_data
        )
        
        return success

    def test_invalid_role_registration(self):
        """Test registration with invalid role"""
        invalid_data = {
            "name": "Test User",
            "email": f"invalid_{uuid.uuid4().hex[:8]}@test.com",
            "password": "TestPass123!",
            "role": "admin"  # Invalid role
        }
        
        success, _ = self.run_test(
            "Invalid Role Registration (Should Fail)",
            "POST",
            "auth/register",
            400,
            data=invalid_data
        )
        
        return success

    def test_duplicate_email_registration(self):
        """Test registration with duplicate email"""
        if not self.student_user:
            self.log_test("Duplicate Email Registration", False, "No student user to test duplicate")
            return False
            
        duplicate_data = {
            "name": "Another User",
            "email": self.student_user['email'],  # Same email as registered student
            "password": "TestPass123!",
            "role": "teacher"
        }
        
        success, _ = self.run_test(
            "Duplicate Email Registration (Should Fail)",
            "POST",
            "auth/register",
            400,
            data=duplicate_data
        )
        
        return success

    def test_get_current_user_student(self):
        """Test getting current user info for student"""
        if not self.student_token:
            self.log_test("Get Current User (Student)", False, "No student token")
            return False
            
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Get Current User (Student)",
            "GET",
            "auth/me",
            200,
            headers=headers
        )
        
        return success and response.get('role') == 'student'

    def test_get_current_user_teacher(self):
        """Test getting current user info for teacher"""
        if not self.teacher_token:
            self.log_test("Get Current User (Teacher)", False, "No teacher token")
            return False
            
        headers = {'Authorization': f'Bearer {self.teacher_token}'}
        success, response = self.run_test(
            "Get Current User (Teacher)",
            "GET",
            "auth/me",
            200,
            headers=headers
        )
        
        return success and response.get('role') == 'teacher'

    def test_student_dashboard_access(self):
        """Test student dashboard access"""
        if not self.student_token:
            self.log_test("Student Dashboard Access", False, "No student token")
            return False
            
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, response = self.run_test(
            "Student Dashboard Access",
            "GET",
            "dashboard/student",
            200,
            headers=headers
        )
        
        if success:
            # Verify response structure
            expected_keys = ['message', 'user', 'stats']
            if all(key in response for key in expected_keys):
                stats = response['stats']
                expected_stats = ['courses_enrolled', 'assignments_pending', 'overall_progress']
                if all(key in stats for key in expected_stats):
                    return True
                else:
                    self.log_test("Student Dashboard Structure", False, "Missing stats keys")
            else:
                self.log_test("Student Dashboard Structure", False, "Missing response keys")
        
        return success

    def test_teacher_dashboard_access(self):
        """Test teacher dashboard access"""
        if not self.teacher_token:
            self.log_test("Teacher Dashboard Access", False, "No teacher token")
            return False
            
        headers = {'Authorization': f'Bearer {self.teacher_token}'}
        success, response = self.run_test(
            "Teacher Dashboard Access",
            "GET",
            "dashboard/teacher",
            200,
            headers=headers
        )
        
        if success:
            # Verify response structure
            expected_keys = ['message', 'user', 'stats']
            if all(key in response for key in expected_keys):
                stats = response['stats']
                expected_stats = ['courses_teaching', 'total_students', 'pending_reviews']
                if all(key in stats for key in expected_stats):
                    return True
                else:
                    self.log_test("Teacher Dashboard Structure", False, "Missing stats keys")
            else:
                self.log_test("Teacher Dashboard Structure", False, "Missing response keys")
        
        return success

    def test_cross_role_access_student_to_teacher(self):
        """Test student trying to access teacher dashboard (should fail)"""
        if not self.student_token:
            self.log_test("Cross-Role Access (Student->Teacher)", False, "No student token")
            return False
            
        headers = {'Authorization': f'Bearer {self.student_token}'}
        success, _ = self.run_test(
            "Cross-Role Access Student->Teacher (Should Fail)",
            "GET",
            "dashboard/teacher",
            403,
            headers=headers
        )
        
        return success

    def test_cross_role_access_teacher_to_student(self):
        """Test teacher trying to access student dashboard (should fail)"""
        if not self.teacher_token:
            self.log_test("Cross-Role Access (Teacher->Student)", False, "No teacher token")
            return False
            
        headers = {'Authorization': f'Bearer {self.teacher_token}'}
        success, _ = self.run_test(
            "Cross-Role Access Teacher->Student (Should Fail)",
            "GET",
            "dashboard/student",
            403,
            headers=headers
        )
        
        return success

    def test_unauthorized_dashboard_access(self):
        """Test dashboard access without token"""
        success1, _ = self.run_test(
            "Unauthorized Student Dashboard (Should Fail)",
            "GET",
            "dashboard/student",
            401
        )
        
        success2, _ = self.run_test(
            "Unauthorized Teacher Dashboard (Should Fail)",
            "GET",
            "dashboard/teacher",
            401
        )
        
        return success1 and success2

    def test_invalid_token_access(self):
        """Test dashboard access with invalid token"""
        headers = {'Authorization': 'Bearer invalid_token_here'}
        
        success1, _ = self.run_test(
            "Invalid Token Student Dashboard (Should Fail)",
            "GET",
            "dashboard/student",
            401,
            headers=headers
        )
        
        success2, _ = self.run_test(
            "Invalid Token Teacher Dashboard (Should Fail)",
            "GET",
            "dashboard/teacher",
            401,
            headers=headers
        )
        
        return success1 and success2

    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting EduGate API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test registration flows
        print("\n📝 Testing Registration...")
        self.test_student_registration()
        self.test_teacher_registration()
        self.test_invalid_role_registration()
        self.test_duplicate_email_registration()
        
        # Test login flows
        print("\n🔐 Testing Login...")
        self.test_student_login()
        self.test_teacher_login()
        self.test_invalid_login()
        
        # Test user info
        print("\n👤 Testing User Info...")
        self.test_get_current_user_student()
        self.test_get_current_user_teacher()
        
        # Test dashboard access
        print("\n📊 Testing Dashboard Access...")
        self.test_student_dashboard_access()
        self.test_teacher_dashboard_access()
        
        # Test security and authorization
        print("\n🔒 Testing Security & Authorization...")
        self.test_cross_role_access_student_to_teacher()
        self.test_cross_role_access_teacher_to_student()
        self.test_unauthorized_dashboard_access()
        self.test_invalid_token_access()
        
        # Print results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"❌ {self.tests_run - self.tests_passed} tests failed")
            print("\nFailed tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
            return 1

def main():
    tester = EduGateAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())