# Generated by Django 5.0.6 on 2024-11-03 05:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="personalinfo",
            name="cover_image",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="personalinfo",
            name="profile_image",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
