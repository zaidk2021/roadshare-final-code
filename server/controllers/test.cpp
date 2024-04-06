#include<stdio.h>
#include<stdlib.h>
#include<string>
#include <iostream>
using namespace std;
int main(){
    string s;
    cin>>s;
    int l=s.length();
    if(l%2==0)
    {int mid=l/2;
    for(int i=0;(i+mid)<l;i++)
    {int p=s[i+mid];
        s[i+mid]=s[l-i-1];
        s[l-i-1]=p;

    }}
    else
    {int mid=l/2+1;
    for(int i=0;(i+mid)<l;i++)
    {int p=s[i+mid];
        s[i+mid]=s[l-i-1];
        s[l-i-1]=p;
    }}
    cout<<s;
    return 0;

}
