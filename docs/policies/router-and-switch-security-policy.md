# Router and Switch Security Policy

**Free Use Disclaimer:** *This policy was created by or for the SANS Institute for the Internet community. All or parts of this policy can be freely used for your organization. There is no prior approval required. If you would like to contribute a new policy or updated version of this policy, please send email to policy-resources@sans.org.*

**Last Update Status:** *Updated June 2014*

## 1.   Overview

See Purpose.

## 2.   Purpose

This document describes a required minimal security configuration for all routers and switches connecting to a production network or used in a production capacity at or on behalf of Yodata.

## 3.   Scope

All employees, contractors, consultants, temporary and other workers at Yodata and its subsidiaries must adhere to this policy. All routers and switches connected to Yodata production networks are affected.

## 4.   Policy

Every router must meet the following configuration standards:

1. No local user accounts are configured on the router. Routers and switches must use TACACS+ for all user authentication.

2. The enable password on the router or switch must be kept in a secure encrypted form. The router or switch must have the enable password set to the current production router/switch password from the device’s support organization.

3. The following services or features must be disabled:

   a. IP directed broadcasts

   b. Incoming packets at the router/switch sourced with invalid addresses such as RFC1918 addresses

   c. TCP small services

   d. UDP small services

   e. All source routing and switching

   f. All web services running on router

   g. Yodata discovery protocol on Internet connected interfaces

   h. Telnet, FTP, and HTTP services

   i. Auto-configuration

4. The following services should be disabled unless a business justification is provided:

   a. Yodata discovery protocol and other discovery protocols
	 
   b. Dynamic trunking
	 
   c. Scripting environments, such as the TCL shell

5. The following services must be configured:

   a. Password-encryption
	 
   b. NTP configured to a corporate standard source

6. All routing updates shall be done using secure routing updates.

7. Use corporate standardized SNMP community strings.  Default strings, such as public or private must be removed.  SNMP must be configured to use the most secure version of the protocol allowed for by the combination of the device and management systems.

8. Access control lists must be used to limit the source and type of traffic that can terminate on the device itself.
9. Access control lists for transiting the device are to be added as business needs arise. 
10. The router must be included in the corporate enterprise management system with a designated point of contact. 
11. Each router must have the following statement presented for all forms of login whether remote or local: 

**"UNAUTHORIZED ACCESS TO THIS NETWORK DEVICE IS PROHIBITED. You must have explicit permission to access or configure this device. All activities performed on this device may be logged, and violations of this policy may result in disciplinary action, and may be reported to law enforcement. There is no right to privacy on this device. Use of this system shall constitute consent to monitoring."**

12.  Telnet may never be used across any network to manage a router, unless there is a secure tunnel protecting the entire communication path. SSH version 2 is the preferred management protocol.
13.  Dynamic routing protocols must use authentication in routing updates sent to neighbors.  Password hashing for the authentication string must be enabled when supported.
14.  The corporate router configuration standard will define the category of sensitive routing and switching devices, and require additional services or configuration on sensitive devices including:

a. IP access list accounting

b. Device logging

c. Incoming packets at the router sourced with invalid addresses, such as RFC1918 addresses, or those that could be used to spoof network traffic shall be dropped

d. Router console and modem access must be restricted by additional security controls

## 5.   Policy Compliance

### 5.1  Compliance Measurement

The Infosec team will verify compliance to this policy through various methods, including but not limited to, periodic walk-thrus, video monitoring, business tool reports, internal and external audits, and feedback to the policy owner.

### 5.2  Exceptions

Any exception to the policy must be approved by the Infosec team in advance. 

### 5.3  Non-Compliance

An employee found to have violated this policy may be subject to disciplinary action, up to and including termination of employment. 

## 6     Related Standards, Policies and Processes

None.

## 7     Definitions and Terms

None.

## 8     Revision History

| Date of Change | Responsible      | Summary of Change                      |
| -------------- | ---------------- | -------------------------------------- |
| June 2014      | SANS Policy Team | Updated and   converted to new format. |
|                |                  |                                        |
