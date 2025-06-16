#!/usr/bin/env python3
"""
Script for registering a job batch file with the Intelligent Automation API.
This script sends a POST request to register a file and returns the response
which includes file_id and file_output_upload_url needed for subsequent operations.
"""

import requests
import json
import argparse
import sys

def register_job_batch_file(project_code, workflow_code, content_acquisition_task_uid, file_name, ia_api_token, meta_data=None):
    """
    Register a job batch file with the Intelligent Automation API
    
    Args:
        project_code (str): The project code
        workflow_code (str): The workflow code
        content_acquisition_task_uid (str): The task UID for content acquisition
        file_name (str): The name of the file to register
        ia_api_token (str): API token for authentication
        meta_data (dict, optional): Additional metadata to include. Defaults to None.
    
    Returns:
        dict: The API response containing file_id and file_output_upload_url
    """
    url = "https://test-intelligentautomation.innodata.com/api/register-job-batch-file"
    
    # Set default metadata if none is provided
    if meta_data is None:
        meta_data = {
            "M1": "V1",
            "M2": "V2"
        }
    
    payload = json.dumps({
        "project_code": project_code,
        "workflow_code": workflow_code,
        "first_task_uid": content_acquisition_task_uid,
        "file_unique_identifier": f"file-uid-{file_name}",  # Generate a unique identifier based on filename
        "file_name": file_name,
        "file_path": "-",
        "meta_data": meta_data
    })
    
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ia_api_token
    }
    
    try:
        response = requests.request("POST", url, headers=headers, data=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response status code: {e.response.status_code}")
            print(f"Response content: {e.response.text}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Register a job batch file with the Intelligent Automation API')
    parser.add_argument('--project-code', required=True, help='Project code')
    parser.add_argument('--workflow-code', required=True, help='Workflow code')
    parser.add_argument('--task-uid', required=True, help='Content acquisition task UID')
    parser.add_argument('--file-name', required=True, help='File name')
    parser.add_argument('--token', required=True, help='API token for authentication')
    parser.add_argument('--meta-data', type=json.loads, help='JSON string of metadata key-value pairs')
    
    args = parser.parse_args()
    
    response = register_job_batch_file(
        args.project_code,
        args.workflow_code,
        args.task_uid,
        args.file_name,
        args.token,
        args.meta_data
    )
    
    print(json.dumps(response, indent=2))
    print("\nImportant values for subsequent requests:")
    print(f"file_id: {response.get('file_id')}")
    print(f"file_output_upload_url: {response.get('file_output_upload_url')}")

if __name__ == "__main__":
    main()
