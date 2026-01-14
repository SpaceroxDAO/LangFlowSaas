#!/usr/bin/env python3
"""
Health Check Script

Checks the health of all Teach Charlie services.

Usage:
    python -m scripts.health_check
    python -m scripts.health_check --verbose

Environment Variables:
    DATABASE_URL: PostgreSQL connection string
    LANGFLOW_API_URL: Langflow API URL
    BACKEND_URL: Backend API URL
"""
import argparse
import os
import sys
from pathlib import Path

import httpx

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


def get_env_urls() -> dict:
    """Get service URLs from environment."""
    return {
        "database": os.environ.get(
            "DATABASE_URL",
            "postgresql://postgres:postgres@localhost:5432/teachcharlie"
        ),
        "langflow": os.environ.get("LANGFLOW_API_URL", "http://localhost:7860"),
        "backend": os.environ.get("BACKEND_URL", "http://localhost:8000"),
        "frontend": os.environ.get("FRONTEND_URL", "http://localhost:80"),
    }


def check_database(db_url: str, verbose: bool = False) -> tuple:
    """
    Check database connectivity.

    Returns:
        Tuple of (is_healthy, message)
    """
    try:
        from sqlalchemy import create_engine, text

        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()

        # Get table counts if verbose
        if verbose:
            with engine.connect() as conn:
                tables = ["projects", "agent_components", "workflows", "messages"]
                counts = []
                for table in tables:
                    try:
                        r = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                        count = r.scalar()
                        counts.append(f"{table}: {count}")
                    except:
                        counts.append(f"{table}: N/A")
                return True, f"Connected ({', '.join(counts)})"

        return True, "Connected"

    except Exception as e:
        return False, f"Error: {e}"


def check_http_service(name: str, url: str, health_path: str = "/health") -> tuple:
    """
    Check HTTP service health.

    Returns:
        Tuple of (is_healthy, message)
    """
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(f"{url}{health_path}")

            if response.status_code == 200:
                # Try to get response body
                try:
                    body = response.json()
                    status = body.get("status", "ok")
                    return True, f"Healthy (status: {status})"
                except:
                    return True, "Healthy"
            else:
                return False, f"Unhealthy (HTTP {response.status_code})"

    except httpx.ConnectError:
        return False, "Connection refused"
    except httpx.TimeoutException:
        return False, "Timeout"
    except Exception as e:
        return False, f"Error: {e}"


def check_langflow(url: str, verbose: bool = False) -> tuple:
    """
    Check Langflow service health.

    Returns:
        Tuple of (is_healthy, message)
    """
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(f"{url}/health")

            if response.status_code == 200:
                if verbose:
                    # Get flow count
                    try:
                        flows_response = client.get(f"{url}/api/v1/flows/")
                        if flows_response.status_code == 200:
                            flows = flows_response.json()
                            count = len(flows) if isinstance(flows, list) else "N/A"
                            return True, f"Healthy ({count} flows)"
                    except:
                        pass
                return True, "Healthy"
            else:
                return False, f"Unhealthy (HTTP {response.status_code})"

    except httpx.ConnectError:
        return False, "Connection refused"
    except httpx.TimeoutException:
        return False, "Timeout"
    except Exception as e:
        return False, f"Error: {e}"


def run_health_check(verbose: bool = False) -> dict:
    """
    Run health checks on all services.

    Returns:
        Dict with health status for each service
    """
    urls = get_env_urls()
    results = {}

    # Check database
    print("Checking services...")
    print("-" * 50)

    # Database
    db_healthy, db_msg = check_database(urls["database"], verbose)
    results["database"] = {"healthy": db_healthy, "message": db_msg}
    status_icon = "OK" if db_healthy else "FAIL"
    print(f"  [{status_icon}] Database: {db_msg}")

    # Langflow
    lf_healthy, lf_msg = check_langflow(urls["langflow"], verbose)
    results["langflow"] = {"healthy": lf_healthy, "message": lf_msg, "url": urls["langflow"]}
    status_icon = "OK" if lf_healthy else "FAIL"
    print(f"  [{status_icon}] Langflow: {lf_msg}")

    # Backend
    be_healthy, be_msg = check_http_service("Backend", urls["backend"], "/health")
    results["backend"] = {"healthy": be_healthy, "message": be_msg, "url": urls["backend"]}
    status_icon = "OK" if be_healthy else "FAIL"
    print(f"  [{status_icon}] Backend: {be_msg}")

    # Frontend (nginx)
    fe_healthy, fe_msg = check_http_service("Frontend", urls["frontend"], "/")
    results["frontend"] = {"healthy": fe_healthy, "message": fe_msg, "url": urls["frontend"]}
    status_icon = "OK" if fe_healthy else "FAIL"
    print(f"  [{status_icon}] Frontend: {fe_msg}")

    print("-" * 50)

    # Overall status
    all_healthy = all(r["healthy"] for r in results.values())
    results["overall"] = {"healthy": all_healthy}

    if all_healthy:
        print("All services healthy!")
    else:
        unhealthy = [name for name, r in results.items() if not r.get("healthy", True) and name != "overall"]
        print(f"WARNING: Unhealthy services: {', '.join(unhealthy)}")

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Check health of Teach Charlie services"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show detailed information"
    )
    parser.add_argument(
        "--json", "-j",
        action="store_true",
        help="Output as JSON"
    )

    args = parser.parse_args()

    results = run_health_check(verbose=args.verbose)

    if args.json:
        import json
        print(json.dumps(results, indent=2))

    # Exit with error code if unhealthy
    sys.exit(0 if results["overall"]["healthy"] else 1)


if __name__ == "__main__":
    main()
